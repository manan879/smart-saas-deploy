
import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

type TemplateType = {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
};

const templates: TemplateType[] = [
  {
    id: 'standard',
    name: 'Standard Invoice',
    description: 'A clean, professional invoice template suitable for most businesses.',
    imageSrc: 'https://placehold.co/600x400?text=Standard+Invoice+Template'
  },
  {
    id: 'modern',
    name: 'Modern Design',
    description: 'A contemporary template with a sleek, minimal design.',
    imageSrc: 'https://placehold.co/600x400?text=Modern+Invoice+Template'
  },
  {
    id: 'creative',
    name: 'Creative Invoice',
    description: 'A bold, creative template for design professionals and creatives.',
    imageSrc: 'https://placehold.co/600x400?text=Creative+Invoice+Template'
  }
];

export const InvoiceTemplates = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleUseTemplate = (templateId: string) => {
    setOpen(false);
    navigate('/create-invoice', { state: { templateId } });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-gray-300">
          <FileText className="w-4 h-4 mr-2" />
          View Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Invoice Templates</DialogTitle>
          <DialogDescription>
            Choose a template to start creating your invoice.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto py-4">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{template.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative overflow-hidden rounded-md mb-2">
                  <img 
                    src={template.imageSrc} 
                    alt={template.name} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <p className="text-sm text-gray-500">{template.description}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleUseTemplate(template.id)}
                  className="w-full"
                >
                  Use Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
