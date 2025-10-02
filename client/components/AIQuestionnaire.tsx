import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import quoteService from '@/services/quoteService';

const AIQuestionnaire: React.FC = () => {
  const [step, setStep] = useState(0);
  const [client, setClient] = useState({ name: '', email: '', phone: '' });
  const [project, setProject] = useState({ title: '', description: '' });
  const [services, setServices] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const addService = () => setServices((s) => [...s, { name: '', description: '', quantity: 1, unitPrice: 0 }]);

  const generatePdf = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client, project, services }),
      });
      const json = await res.json();
      if (json.url) {
        setPdfUrl(json.url);
      }
    } catch (e) {
      console.error(e);
      alert('Erreur génération PDF');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Assistant IA - Questionnaire</h3>
      {step === 0 && (
        <div>
          <div className="mb-2"><label className="block text-sm font-medium">Nom</label><Input value={client.name} onChange={(e)=>setClient({...client,name:e.target.value})} /></div>
          <div className="mb-2"><label className="block text-sm font-medium">Email</label><Input value={client.email} onChange={(e)=>setClient({...client,email:e.target.value})} /></div>
          <div className="mb-2"><label className="block text-sm font-medium">Téléphone</label><Input value={client.phone} onChange={(e)=>setClient({...client,phone:e.target.value})} /></div>
        </div>
      )}

      {step === 1 && (
        <div>
          <div className="mb-2"><label className="block text-sm font-medium">Titre du projet</label><Input value={project.title} onChange={(e)=>setProject({...project,title:e.target.value})} /></div>
          <div className="mb-2"><label className="block text-sm font-medium">Description</label><Textarea value={project.description} onChange={(e)=>setProject({...project,description:e.target.value})} /></div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="mb-2"><Button onClick={addService}>Ajouter un service</Button></div>
          {services.map((s, idx)=> (
            <div key={idx} className="mb-2 border rounded p-2">
              <Input placeholder="Nom du service" value={s.name} onChange={(e)=>{ const ns = [...services]; ns[idx].name = e.target.value; setServices(ns); }} />
              <Input placeholder="Prix unitaire" value={s.unitPrice} type="number" onChange={(e)=>{ const ns = [...services]; ns[idx].unitPrice = Number(e.target.value); setServices(ns); }} />
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-4">
        {step>0 && <Button variant="outline" onClick={prev}>Précédent</Button>}
        {step<2 && <Button onClick={next}>Suivant</Button>}
        {step===2 && <Button onClick={generatePdf} disabled={generating}>{generating? 'Génération...' : 'Générer PDF'}</Button>}
      </div>

      {pdfUrl && (
        <div className="mt-4">
          <a href={pdfUrl} target="_blank" rel="noreferrer" className="text-blue-600">Télécharger le PDF</a>
        </div>
      )}
    </div>
  );
};

export default AIQuestionnaire;
