"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SearchDetails {
  id: string;
  query: string;
  groupId: string;
  createdAt: string;
  responses: ResponseDetails[];
  userId?: string;
  ip?: string;
  userAgent?: string;
}

interface ResponseDetails {
  id: string;
  content: string;
  searchId: string;
  createdAt: string;
  toolsUsed: string[];
  metadata?: any;
}

export default function SearchPage() {
  const params = useParams();
  const searchId = params.id as string;
  const [search, setSearch] = useState<SearchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/search/${searchId}`);
        if (!response.ok) {
          throw new Error('Impossible de récupérer les détails de la recherche');
        }
        
        const data = await response.json();
        setSearch(data.search);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails:', error);
        setError('Une erreur est survenue lors de la récupération des détails de la recherche');
      } finally {
        setLoading(false);
      }
    };

    if (searchId) {
      fetchSearchDetails();
    }
  }, [searchId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 dark:border-gray-700 rounded-full border-t-blue-600 mx-auto mb-4"></div>
          <p>Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (error || !search) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-red-500">Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || 'Recherche non trouvée'}</p>
            <Link href="/">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à l&apos;accueil
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Formatter la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtenir le temps écoulé
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistance(date, new Date(), { 
      addSuffix: true,
      locale: fr
    });
  };

  return (
    <div className="container max-w-4xl py-8 px-4">
      <Link href="/">
        <Button variant="outline" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </Link>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Recherche: {search.query}</CardTitle>
            <div className={`text-xs px-3 py-1 rounded-full ${
              search.groupId === 'web' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
              search.groupId === 'academic' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
              'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
            }`}>
              {search.groupId}
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            {formatDate(search.createdAt)} ({getTimeAgo(search.createdAt)})
          </div>
        </CardHeader>
      </Card>

      {search.responses.map((response, index) => (
        <Card key={response.id} className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Réponse {index + 1}</CardTitle>
            <div className="text-sm text-gray-500">{formatDate(response.createdAt)}</div>
            {response.toolsUsed && response.toolsUsed.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {response.toolsUsed.map((tool) => (
                  <span key={tool} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {tool}
                  </span>
                ))}
              </div>
            )}
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>
                {response.content}
              </ReactMarkdown>
            </div>
            
            {response.metadata && (
              <>
                <Separator className="my-4" />
                <div>
                  <h3 className="text-sm font-medium mb-2">Métadonnées</h3>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-xs overflow-auto">
                    {JSON.stringify(response.metadata, null, 2)}
                  </pre>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 