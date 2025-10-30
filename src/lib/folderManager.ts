// Persistent folder management using File System Access API and IndexedDB

const DB_NAME = 'doc-one-storage';
const STORE_NAME = 'folder-handles';
const FOLDER_KEY = 'doc-one-folder';

interface DocOneFile {
  name: string;
  content: string;
  savedAt: string;
  version: string;
}

// Check if File System Access API is supported
export const isFileSystemAccessSupported = (): boolean => {
  return 'showDirectoryPicker' in window;
};

// Initialize IndexedDB
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

// Store directory handle in IndexedDB
const storeDirectoryHandle = async (handle: FileSystemDirectoryHandle): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({
      handle,
      setupDate: new Date().toISOString()
    }, FOLDER_KEY);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Retrieve directory handle from IndexedDB
const getStoredDirectoryHandle = async (): Promise<FileSystemDirectoryHandle | null> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(FOLDER_KEY);
      
      request.onsuccess = () => {
        const result = request.result;
        resolve(result?.handle || null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error retrieving directory handle:', error);
    return null;
  }
};

// Verify and request permission for directory handle
const verifyPermission = async (handle: FileSystemDirectoryHandle): Promise<boolean> => {
  const options = { mode: 'readwrite' as const };
  
  // Check if permission is already granted
  if ((await handle.queryPermission(options)) === 'granted') {
    return true;
  }
  
  // Request permission
  if ((await handle.requestPermission(options)) === 'granted') {
    return true;
  }
  
  return false;
};

// Setup Doc One folder (first-time or reset)
export const setupDocOneFolder = async (): Promise<boolean> => {
  if (!isFileSystemAccessSupported()) {
    console.warn('File System Access API not supported');
    return false;
  }
  
  try {
    const dirHandle = await window.showDirectoryPicker({
      mode: 'readwrite',
      startIn: 'documents'
    });
    
    // Verify permission
    const hasPermission = await verifyPermission(dirHandle);
    if (!hasPermission) {
      return false;
    }
    
    // Store the handle
    await storeDirectoryHandle(dirHandle);
    return true;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      console.log('Folder selection cancelled');
    } else {
      console.error('Error setting up folder:', error);
    }
    return false;
  }
};

// Get the Doc One folder handle
export const getDocOneFolder = async (): Promise<FileSystemDirectoryHandle | null> => {
  try {
    const handle = await getStoredDirectoryHandle();
    if (!handle) {
      return null;
    }
    
    // Verify permission is still granted
    const hasPermission = await verifyPermission(handle);
    if (!hasPermission) {
      return null;
    }
    
    return handle;
  } catch (error) {
    console.error('Error getting Doc One folder:', error);
    return null;
  }
};

// Check if Doc One folder is configured
export const hasDocOneFolderAccess = async (): Promise<boolean> => {
  if (!isFileSystemAccessSupported()) {
    return false;
  }
  
  const handle = await getDocOneFolder();
  return handle !== null;
};

// Save document to Doc One folder
export const saveToDocOne = async (name: string, content: string): Promise<string | null> => {
  try {
    const dirHandle = await getDocOneFolder();
    if (!dirHandle) {
      throw new Error('No folder access');
    }
    
    // Sanitize filename
    const sanitizedName = name.replace(/[^a-z0-9_\-\s]/gi, '_');
    const filename = `${sanitizedName}.doc1`;
    
    // Create file data
    const fileData: DocOneFile = {
      name: sanitizedName,
      content,
      savedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    // Create or overwrite file
    const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(fileData, null, 2));
    await writable.close();
    
    return sanitizedName;
  } catch (error) {
    console.error('Error saving to Doc One:', error);
    return null;
  }
};

// List all .doc1 files in Doc One folder
export const listDocOneFiles = async (): Promise<Array<{ name: string; savedAt: string }>> => {
  try {
    const dirHandle = await getDocOneFolder();
    if (!dirHandle) {
      return [];
    }
    
    const files: Array<{ name: string; savedAt: string }> = [];
    
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file' && entry.name.endsWith('.doc1')) {
        try {
          const fileHandle = await dirHandle.getFileHandle(entry.name);
          const file = await fileHandle.getFile();
          const content = await file.text();
          const data = JSON.parse(content) as DocOneFile;
          
          files.push({
            name: data.name,
            savedAt: data.savedAt
          });
        } catch (error) {
          console.error(`Error reading file ${entry.name}:`, error);
        }
      }
    }
    
    // Sort by savedAt descending (newest first)
    files.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
    
    return files;
  } catch (error) {
    console.error('Error listing Doc One files:', error);
    return [];
  }
};

// Load a specific document from Doc One folder
export const loadDocOneFile = async (name: string): Promise<{ name: string; content: string } | null> => {
  try {
    const dirHandle = await getDocOneFolder();
    if (!dirHandle) {
      throw new Error('No folder access');
    }
    
    const filename = `${name}.doc1`;
    const fileHandle = await dirHandle.getFileHandle(filename);
    const file = await fileHandle.getFile();
    const content = await file.text();
    const data = JSON.parse(content) as DocOneFile;
    
    return {
      name: data.name,
      content: data.content
    };
  } catch (error) {
    console.error('Error loading file:', error);
    return null;
  }
};

// Fallback: Download file (for unsupported browsers)
export const downloadFile = (name: string, content: string): void => {
  const fileData: DocOneFile = {
    name,
    content,
    savedAt: new Date().toISOString(),
    version: '1.0'
  };
  
  const blob = new Blob([JSON.stringify(fileData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.doc1`;
  a.click();
  URL.revokeObjectURL(url);
};

// Fallback: Upload file (for unsupported browsers)
export const uploadFile = (): Promise<{ name: string; content: string } | null> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.doc1';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      
      try {
        const content = await file.text();
        const data = JSON.parse(content) as DocOneFile;
        resolve({
          name: data.name,
          content: data.content
        });
      } catch (error) {
        console.error('Error reading file:', error);
        resolve(null);
      }
    };
    
    input.click();
  });
};

// Clear stored folder (for reset)
export const clearDocOneFolder = async (): Promise<void> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(FOLDER_KEY);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error clearing folder:', error);
  }
};
