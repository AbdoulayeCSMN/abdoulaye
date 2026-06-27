'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Mail, Phone, User, CalendarDays, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  nom: string;
  email: string;
  tel?: string;
  objet: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/messages');
    if (res.ok) setMessages(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  async function markRead(id: string) {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_read: true }),
    });
    if (res.ok) {
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, is_read: true } : m));
      toast.success('Message marqué comme lu');
    }
  }

  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          Messages reçus
          {unread > 0 && <Badge className="bg-primary text-primary-foreground">{unread} non lu{unread > 1 ? 's' : ''}</Badge>}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Messages envoyés via le formulaire de contact.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed rounded-xl">
          <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
          <p className="text-lg font-medium text-muted-foreground">Aucun message pour le moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {messages.map((message) => (
            <Card
              key={message.id}
              className={`shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                !message.is_read ? 'border-primary/40 bg-primary/5' : ''
              }`}
            >
              <CardHeader className="space-y-2 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <User className="w-4 h-4 text-primary flex-shrink-0" />
                    {message.nom}
                  </CardTitle>
                  {!message.is_read && (
                    <Badge variant="secondary" className="text-xs flex-shrink-0">Nouveau</Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${message.email}`} className="hover:text-primary transition-colors truncate">
                    {message.email}
                  </a>
                </div>

                {message.tel && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${message.tel}`} className="hover:text-primary transition-colors">
                      {message.tel}
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {new Date(message.created_at).toLocaleString('fr-FR', {
                    dateStyle: 'medium', timeStyle: 'short'
                  })}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary">Objet</span>
                  <p className="mt-0.5 font-medium text-sm">{message.objet}</p>
                </div>

                <div className="bg-muted/40 p-3 rounded-lg text-sm leading-relaxed">
                  {message.content}
                </div>

                {!message.is_read && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => markRead(message.id)}
                  >
                    <CheckCheck className="h-4 w-4" />
                    Marquer comme lu
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
