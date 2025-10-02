import React, { useEffect, useState } from 'react';
import quoteService from '@/services/quoteService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminDevis: React.FC = () => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = React.useState('');
  const [serviceFilter, setServiceFilter] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [page, setPage] = React.useState(0);
  const pageSize = 20;

  useEffect(() => {
    load();
  }, [search, serviceFilter, startDate, endDate, page]);

  async function load() {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { limit: pageSize, offset: page * pageSize };
      if (search) params.search = search;
      if (serviceFilter) params.service = serviceFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const data = await quoteService.getQuoteRequests(params);
      setQuotes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const [replyTo, setReplyTo] = React.useState<any | null>(null);
  const [replyMessage, setReplyMessage] = React.useState('');
  const [replySubject, setReplySubject] = React.useState('Réponse à votre demande de devis');

  const exportCsv = () => {
    if (!quotes || quotes.length === 0) return;
    const headers = ['id','name','email','phone','service','message','created_at'];
    const rows = quotes.map((q) => headers.map((h) => `"${String(q[h] ?? '')}"`).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes_export.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const sendReply = async () => {
    if (!replyTo) return;
    try {
      await quoteService.replyQuote(replyTo.id, replySubject, replyMessage);
      alert('Réponse envoyée');
      setReplyTo(null);
      setReplyMessage('');
    } catch (e: any) {
      console.error(e);
      alert('Erreur envoi : ' + (e.message || e));
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <h2 className="text-2xl font-bold">Gestion des devis</h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input className="border rounded p-2" placeholder="Rechercher par nom / email / message" value={search} onChange={(e)=>setSearch(e.target.value)} />
          <input type="date" className="border rounded p-2" value={startDate} onChange={(e)=>setStartDate(e.target.value)} />
          <input type="date" className="border rounded p-2" value={endDate} onChange={(e)=>setEndDate(e.target.value)} />
          <input className="border rounded p-2" placeholder="Service" value={serviceFilter} onChange={(e)=>setServiceFilter(e.target.value)} />
          <Button onClick={()=>{ setSearch(''); setServiceFilter(''); setStartDate(''); setEndDate(''); setPage(0); }} variant="ghost">Réinitialiser</Button>
          <Button onClick={load} className="mr-2">Rafraîchir</Button>
          <Button onClick={exportCsv} variant="outline">Exporter CSV</Button>
        </div>
      </div>

      {replyTo && (
        <Card className="mb-4 bg-white border">
          <CardContent>
            <h3 className="font-semibold">Répondre à: {replyTo.name} &lt;{replyTo.email}&gt;</h3>
            <input className="w-full border rounded p-2 mt-2" value={replySubject} onChange={(e)=>setReplySubject(e.target.value)} />
            <textarea className="w-full border rounded p-2 mt-2 h-32" value={replyMessage} onChange={(e)=>setReplyMessage(e.target.value)} />
            <div className="flex gap-2 mt-2">
              <Button onClick={sendReply}>Envoyer</Button>
              <Button variant="outline" onClick={()=>setReplyTo(null)}>Annuler</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {quotes.map((q) => (
          <Card key={q.id} className="bg-white">
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-lg text-gray-900 truncate">{q.name}</div>
                  <div className="text-sm text-gray-700">{q.email} • {q.phone}</div>
                  <div className="mt-2 text-gray-800 whitespace-pre-wrap">{q.message}</div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <div className="text-sm text-gray-500">#{q.id}</div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={()=>setReplyTo(q)}>Répondre</Button>
                    <Button size="sm" variant="outline" onClick={()=>navigator.clipboard.writeText(window.location.origin + '/quote/' + q.id)}>Lien</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {quotes.length === 0 && !loading && <div className="text-gray-600">Aucune demande.</div>}
      </div>
    </div>
  );
};

export default AdminDevis;
