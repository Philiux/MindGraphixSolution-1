import React, { useEffect, useState } from 'react';
import applicationService from '@/services/applicationService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminApplications: React.FC = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);
  async function load(){
    setLoading(true);
    try{
      const json = await applicationService.getApplications();
      setApps(json.applications || []);
    }catch(e){ console.error(e); }
    setLoading(false);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Candidatures</h2>
        <div>
          <Button onClick={load}>Rafraîchir</Button>
        </div>
      </div>

      <div className="grid gap-4">
        {apps.map(a => (
          <Card key={a.id}><CardContent>
            <div className="flex justify-between">
              <div>
                <div className="font-semibold text-lg">{a.name}</div>
                <div className="text-sm text-gray-700">{a.email} • {a.phone}</div>
                <div className="mt-2">{a.position}</div>
                <div className="mt-2 whitespace-pre-wrap text-gray-800">{a.message}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">#{a.id}</div>
                <div className="mt-2">
                  {a.files && a.files.map((f:any)=>(<div key={f.url}><a href={f.url} target="_blank" rel="noreferrer" className="text-blue-600">{f.name}</a></div>))}
                </div>
              </div>
            </div>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}

export default AdminApplications;
