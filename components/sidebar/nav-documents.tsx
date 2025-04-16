"use client"

import {
  FolderIcon,
  MoreHorizontalIcon,
  ShareIcon,
  ClockIcon,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Search {
  id: string;
  query: string;
  groupId: string;
  createdAt: string;
}

export function NavDocuments({
  items,
  title = "Documents",
  isHistorySection = false,
}: {
  items: {
    name: string
    url: string
    icon: LucideIcon
    date?: string
    id?: string
  }[]
  title?: string
  isHistorySection?: boolean
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [searches, setSearches] = useState<Search[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Récupérer l'historique des recherches si c'est la section d'historique
    if (isHistorySection) {
      const fetchSearchHistory = async () => {
        try {
          setLoading(true)
          const response = await fetch('/api/search-history?limit=10')
          if (response.ok) {
            const data = await response.json()
            setSearches(data.searches || [])
          }
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'historique:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchSearchHistory()
    }
  }, [isHistorySection])

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    })
  }

  // Tronquer le texte
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {isHistorySection ? (
          loading ? (
            <div className="px-2 py-1 text-sm text-muted-foreground">
              Chargement...
            </div>
          ) : searches.length === 0 ? (
            <div className="px-2 py-1 text-sm text-muted-foreground">
              Aucun historique disponible
            </div>
          ) : (
            searches.map((search) => (
              <SidebarMenuItem key={search.id}>
                <SidebarMenuButton 
                  onClick={() => router.push(`/search/${search.id}`)}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <ClockIcon className="h-4 w-4 flex-shrink-0"/>
                    <span className="truncate font-medium">{truncateText(search.query, 20)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(search.createdAt)}</span>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction
                      showOnHover
                      className="rounded-sm data-[state=open]:bg-accent"
                    >
                      <MoreHorizontalIcon />
                      <span className="sr-only">Plus</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem 
                      onClick={() => router.push(`/search/${search.id}`)}
                    >
                      <FolderIcon className="mr-2 h-4 w-4" />
                      <span>Ouvrir la recherche</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ShareIcon className="mr-2 h-4 w-4" />
                      <span>Partager</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))
          )
        ) : (
          items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                  {item.date && (
                    <span className="text-xs text-muted-foreground ml-auto">{item.date}</span>
                  )}
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction
                    showOnHover
                    className="rounded-sm data-[state=open]:bg-accent"
                  >
                    <MoreHorizontalIcon />
                    <span className="sr-only">Plus</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-24 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <FolderIcon />
                    <span>Ouvrir</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ShareIcon />
                    <span>Partager</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
