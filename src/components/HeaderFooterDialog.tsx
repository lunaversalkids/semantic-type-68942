import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';

interface HeaderFooterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (settings: HeaderFooterSettings) => void;
}

export interface HeaderFooterSettings {
  headerLeft: string;
  headerCenter: string;
  headerRight: string;
  footerLeft: string;
  footerCenter: string;
  footerRight: string;
  showPageNumbers: boolean;
  pageNumberPosition: 'header' | 'footer';
  pageNumberAlignment: 'left' | 'center' | 'right';
  differentFirstPage: boolean;
  differentOddEven: boolean;
}

export const HeaderFooterDialog = ({ open, onOpenChange, onSave }: HeaderFooterDialogProps) => {
  const [settings, setSettings] = useState<HeaderFooterSettings>({
    headerLeft: '',
    headerCenter: '',
    headerRight: '',
    footerLeft: '',
    footerCenter: '',
    footerRight: '',
    showPageNumbers: true,
    pageNumberPosition: 'footer',
    pageNumberAlignment: 'center',
    differentFirstPage: false,
    differentOddEven: false,
  });

  const handleSave = () => {
    onSave(settings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Headers & Footers</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="header" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="header">Header</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="header" className="space-y-4">
            <div className="space-y-2">
              <Label>Left</Label>
              <Input
                value={settings.headerLeft}
                onChange={(e) => setSettings({ ...settings, headerLeft: e.target.value })}
                placeholder="Left header content"
              />
            </div>
            <div className="space-y-2">
              <Label>Center</Label>
              <Input
                value={settings.headerCenter}
                onChange={(e) => setSettings({ ...settings, headerCenter: e.target.value })}
                placeholder="Center header content"
              />
            </div>
            <div className="space-y-2">
              <Label>Right</Label>
              <Input
                value={settings.headerRight}
                onChange={(e) => setSettings({ ...settings, headerRight: e.target.value })}
                placeholder="Right header content"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="footer" className="space-y-4">
            <div className="space-y-2">
              <Label>Left</Label>
              <Input
                value={settings.footerLeft}
                onChange={(e) => setSettings({ ...settings, footerLeft: e.target.value })}
                placeholder="Left footer content"
              />
            </div>
            <div className="space-y-2">
              <Label>Center</Label>
              <Input
                value={settings.footerCenter}
                onChange={(e) => setSettings({ ...settings, footerCenter: e.target.value })}
                placeholder="Center footer content"
              />
            </div>
            <div className="space-y-2">
              <Label>Right</Label>
              <Input
                value={settings.footerRight}
                onChange={(e) => setSettings({ ...settings, footerRight: e.target.value })}
                placeholder="Right footer content"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="options" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Show Page Numbers</Label>
              <Switch
                checked={settings.showPageNumbers}
                onCheckedChange={(checked) => setSettings({ ...settings, showPageNumbers: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Different First Page</Label>
              <Switch
                checked={settings.differentFirstPage}
                onCheckedChange={(checked) => setSettings({ ...settings, differentFirstPage: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Different Odd & Even Pages</Label>
              <Switch
                checked={settings.differentOddEven}
                onCheckedChange={(checked) => setSettings({ ...settings, differentOddEven: checked })}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
