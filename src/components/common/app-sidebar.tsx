'use client';

import { Coffee, EllipsisVertical, LogOut } from 'lucide-react';
import { Sidebar, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


export default function AppSidebar() {
  const {isMobile} = useSidebar();
  return (
    <Sidebar>
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton size="lg">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="" alt=""/>
                      <AvatarFallback className="rounded-lg">A</AvatarFallback>
                    </Avatar>
                    <div className='leading-tight'>
                      <h4 className='truncate font-medium'>Arif Fathur Rahaman</h4>
                      <p className='text-muted-foreground truncate text-xs'>Admin</p>
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
                          <AvatarImage src="" alt=""/>
                          <AvatarFallback className="rounded-lg">A</AvatarFallback>
                        </Avatar>
                        <div className='leading-tight'>
                          <h4 className='truncate font-medium'>Arif Fathur Rahaman</h4>
                          <p className='text-muted-foreground truncate text-xs'>Admin</p>
                        </div>
                      </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator/>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
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