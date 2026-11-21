'use client';

import { Coffee, EllipsisVertical, LogOut } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { SIDEBAR_MENU_LIST, SidebarMenuKey } from '@/constants/sidebar-constans';
import { usePathname } from 'next/navigation';
import { cn } from 'cn';
import { SingOut } from '@/actions/auth-action';
import { useAuthStore } from '@/stores/auth-store';


export default function AppSidebar() {
  const {isMobile} = useSidebar();
  const pathname = usePathname();
  const profile = useAuthStore((state)=> state.profile );
  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
                <div className="flex items-center gap-2 self-center font-medium">
                    <div className="bg-teal-500 flex p-2 items-center justify-center rounded-md">
                        <Coffee className="size-4" />
                    </div>
                    WPU Cafe
                </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_MENU_LIST[profile.role as SidebarMenuKey]?.map((item)=>(
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={
                      <a href={item.url} className={cn('px-4 py-3 h-auto', {
                        'bg-teal-500 text-white hover:bg-teal-500 hover:text-white' : pathname === item.url
                      })}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </a>
                    }
                    tooltip={item.title}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton size="lg" className='data-[state=open]:bg-sidebar-accent data-[stete=open]:text-sidebar-accent-foreground'>
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={profile.avatar_url} alt={profile.name}/>
                      <AvatarFallback className="rounded-lg">{profile.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className='leading-tight'>
                      <h4 className='truncate font-medium'>{profile.name}</h4>
                      <p className='text-muted-foreground truncate text-xs'>{profile.role}</p>
                    </div>
                    <EllipsisVertical className='ml-auto' size="4"/>
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent className="min-w-56 rounded-lg" side={
                isMobile ? 
                'bottom' :
                'right'
                
              } align='end' sideOffset={4}>
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="p-0 font-normal">
                      <div className='flex items-center gap-2 px-1 py-1.5'>
                         <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage src={profile.avatar_url} alt={profile.name}/>
                          <AvatarFallback className="rounded-lg">{profile.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className='leading-tight'>
                          <h4 className='truncate font-medium'>{profile.name}</h4>
                          <p className='text-muted-foreground truncate text-xs'>{profile.role}</p>
                        </div>
                      </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator/>
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={()=> SingOut()}>
                      <LogOut/>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}