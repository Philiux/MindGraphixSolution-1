import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Recrutement: React.FC = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<any[]>([]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    // Convert to base64 and send to upload endpoint
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch('/api/upload/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'SuperAdmin secret' },
          body: JSON.stringify({ imageData: base64, fileName: f.name }),
        });
        const json = await res.json();
        if (json && json.url) {
          setFiles((prev) => [...prev, { url: json.url, name: f.name }]);
          toast({ title: 'Fichier uploadé', description: f.name });
        }
      } catch (e) {
        console.error(e);
        toast({ title: 'Erreur upload', description: String(e), variant: 'destructive' });
      }
    };
    reader.readAsDataURL(f);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, position, message, files }),
      });
      if (!res.ok) throw new Error('Erreur serveur');
      toast({ title: 'Candidature envoyée', description: 'Merci, nous reviendrons vers vous.' });
      setName(''); setEmail(''); setPhone(''); setPosition(''); setMessage(''); setFiles([]);
    } catch (e) {
      console.error(e);
      toast({ title: 'Erreur', description: String(e), variant: 'destructive' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Postuler</h1>
      <div className="grid gap-4">
        <div>
          <Label>Nom complet</Label>
          <Input value={name} onChange={(e)=>setName(e.target.value)} />
        </div>
        <div>
          <Label>Email</Label>
          <Input value={email} onChange={(e)=>setEmail(e.target.value)} />
        </div>
        <div>
          <Label>Téléphone</Label>
          <Input value={phone} onChange={(e)=>setPhone(e.target.value)} />
        </div>
        <div>
          <Label>Poste</Label>
          <Input value={position} onChange={(e)=>setPosition(e.target.value)} />
        </div>
        <div>
          <Label>Message</Label>
          <Textarea value={message} onChange={(e)=>setMessage(e.target.value)} />
        </div>
        <div>
          <Label>CV / Lettre (PDF)</Label>
          <input type="file" accept="application/pdf,image/*" onChange={handleFile} />
          <div className="mt-2">
            {files.map((f) => (<div key={f.url} className="text-sm">{f.name}</div>))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSubmit}>Envoyer</Button>
          <Button variant="outline" onClick={()=>{ setName(''); setEmail(''); setPhone(''); setPosition(''); setMessage(''); setFiles([]); }}>Annuler</Button>
        </div>
      </div>
    </div>
  );
}

export default Recrutement;
