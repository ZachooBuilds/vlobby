(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4750],{7697:function(e,t,r){Promise.resolve().then(r.bind(r,6074))},6074:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return O}});var n=r(909),a=r(151),s=r(4928),i=r(2369),l=r(4441),c=r(810),o=r(1854),d=r(363),u=r(2948),f=r(9061),m=r(9413),x=r(9288),h=r(1411),p=r(838),g=r(3492),v=r(2594),y=r(7338),b=r(5144);function w(e){let{sendMessage:t,chatId:r,isFromOccupant:s}=e,[i,l]=(0,a.useState)(""),c=(0,a.useRef)(null),u=()=>{i.trim()&&(t({createdAt:new Date().toISOString(),chatId:r,content:i.trim(),isFromOccupant:s}),l(""),c.current&&c.current.focus())};return(0,n.jsx)("div",{className:"flex w-full items-center justify-between gap-2 p-2",children:(0,n.jsxs)(o.M,{initial:!1,children:[(0,n.jsx)(d.E.div,{className:" w-full",layout:!0,initial:{opacity:0,scale:1},animate:{opacity:1,scale:1},exit:{opacity:0,scale:1},transition:{opacity:{duration:.05},layout:{type:"spring",bounce:.15}},children:(0,n.jsx)(y.g,{autoComplete:"off",value:i,ref:c,onKeyDown:e=>{"Enter"!==e.key||e.shiftKey||(e.preventDefault(),u()),"Enter"===e.key&&e.shiftKey&&(e.preventDefault(),l(e=>e+"\n"))},onChange:e=>{l(e.target.value)},name:"message",placeholder:"Aa",className:"min-h-2 w-full items-center overflow-hidden rounded-md border bg-background text-base"})},"input"),i.trim()?(0,n.jsx)(v.default,{href:"#",className:(0,f.cn)((0,b.d)({variant:"ghost",size:"icon"}),"h-9 w-9","shrink-0 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"),onClick:u,children:(0,n.jsx)(p.Z,{size:20,className:"text-muted-foreground"})}):(0,n.jsx)(v.default,{href:"#",className:(0,f.cn)((0,b.d)({variant:"ghost",size:"icon"}),"h-9 w-9","shrink-0 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"),onClick:()=>{t({createdAt:new Date().toISOString(),chatId:r,content:"\uD83D\uDC4D",isFromOccupant:s}),l("")},children:(0,n.jsx)(g.Z,{size:20,className:"text-muted-foreground"})})]})})}function N(e){let{messages:t,selectedChat:r,sendMessage:s}=e,i=(0,a.useRef)(null);return(0,a.useEffect)(()=>{i.current&&(i.current.scrollTop=i.current.scrollHeight)},[t]),(0,n.jsxs)("div",{className:"flex h-full w-full flex-col overflow-y-auto overflow-x-hidden",children:[(0,n.jsx)("div",{ref:i,className:"flex h-full w-full flex-col overflow-y-auto overflow-x-hidden",children:(0,n.jsx)(o.M,{children:null==t?void 0:t.map((e,a)=>(0,n.jsx)(d.E.div,{layout:!0,initial:{opacity:0,scale:1,y:50,x:0},animate:{opacity:1,scale:1,y:0,x:0},exit:{opacity:0,scale:1,y:1,x:0},transition:{opacity:{duration:.1},layout:{type:"spring",bounce:.3,duration:.05*t.indexOf(e)+.2}},style:{originX:.5,originY:.5},className:(0,f.cn)("flex flex-col gap-2 whitespace-pre-wrap p-4",e.isFromOccupant?"items-end":"items-start"),children:(0,n.jsxs)("div",{className:"flex items-center gap-3",children:[!e.isFromOccupant&&(0,n.jsx)(m.qE,{className:"h-12 w-12 transition-all duration-300 group-hover:scale-110",children:(0,n.jsx)(m.Q5,{children:"A"})}),(0,n.jsxs)("div",{className:"flex flex-col",children:[(0,n.jsx)("span",{className:(0,f.cn)("max-w-sm rounded-md p-3 text-sm",e.isFromOccupant?"bg-primary text-primary-foreground":"bg-accent"),children:e.content}),(0,n.jsx)("span",{className:"mt-1 text-xs text-muted-foreground",children:(0,u.WU)(new Date(e.createdAt),"PPpp")})]}),e.isFromOccupant&&(0,n.jsx)(m.qE,{className:"h-12 w-12 transition-all duration-300 group-hover:scale-110",children:(0,n.jsx)(m.Q5,{children:r.occupantName.charAt(0)})})]})},a))})}),(0,n.jsx)(w,{sendMessage:s,chatId:r._id,isFromOccupant:!0})]})}function j(e){let{messages:t,selectedChat:r,isMobile:a}=e,s=(0,l.Db)(c.h.chats.addMessage),i=async e=>{if(r)try{await s({chatId:r._id,content:e.content,isFromOccupant:!0})}catch(e){console.error("Failed to send message:",e)}};return(0,n.jsx)("div",{className:"flex h-full w-full flex-col justify-between",children:(0,n.jsx)(N,{messages:t,selectedChat:r,sendMessage:i,isMobile:a})})}x.Z,h.Z;var k=r(8071),C=r(6907);function O(){let e=(0,l.aM)(c.h.occupants.getCurrentOccupant),[t,r]=(0,a.useState)(null),o=(0,l.Db)(c.h.chats.getChatSummaryForOccupant),d=(0,l.aM)(c.h.chats.getChat,t?{chatId:t._id}:"skip");return(0,a.useEffect)(()=>{(null==e?void 0:e._id)&&o({occupantId:e._id}).then(e=>{e&&r(e)}).catch(e=>console.error("Error getting chat summary:",e))},[e,o]),(0,n.jsxs)("div",{className:"flex flex-col h-screen",children:[(0,n.jsx)("div",{className:"flex-grow overflow-hidden",children:(0,n.jsxs)("div",{className:"flex flex-col h-full pt-16 p-4 pb-[120px]",children:[(0,n.jsxs)("div",{className:"flex flex-row items-center gap-2 mb-4",children:[(0,n.jsx)("div",{className:"w-5 h-5 fill-foreground",children:(0,n.jsx)(i.J8,{})}),(0,n.jsx)("h2",{className:"text-xl font-semibold",children:"Reach Out"})]}),(0,n.jsx)(k.Zb,{className:"flex-grow overflow-hidden justify-end",children:d&&t?(0,n.jsx)(j,{messages:d,selectedChat:t,isMobile:!0}):(0,n.jsxs)("div",{className:"flex items-center justify-center h-full",children:[(0,n.jsx)(C.Z,{className:"w-4 h-4 animate-spin text-primary"}),"Fetching messages..."]})})]})}),(0,n.jsx)(s.Z,{})]})}},810:function(e,t,r){"use strict";r.d(t,{h:function(){return n}});let n=r(6979).qL},9413:function(e,t,r){"use strict";r.d(t,{F$:function(){return c},Q5:function(){return o},qE:function(){return l}});var n=r(909),a=r(151),s=r(2419),i=r(9061);let l=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)(s.fC,{ref:t,className:(0,i.cn)("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",r),...a})});l.displayName=s.fC.displayName;let c=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)(s.Ee,{ref:t,className:(0,i.cn)("aspect-square h-full w-full",r),...a})});c.displayName=s.Ee.displayName;let o=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)(s.NY,{ref:t,className:(0,i.cn)("flex h-full w-full items-center justify-center rounded-full bg-muted",r),...a})});o.displayName=s.NY.displayName},5144:function(e,t,r){"use strict";r.d(t,{d:function(){return c},z:function(){return o}});var n=r(909),a=r(151),s=r(1875),i=r(6271),l=r(9061);let c=(0,i.j)("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),o=a.forwardRef((e,t)=>{let{className:r,variant:a,size:i,asChild:o=!1,...d}=e,u=o?s.g7:"button";return(0,n.jsx)(u,{className:(0,l.cn)(c({variant:a,size:i,className:r})),ref:t,...d})});o.displayName="Button"},8071:function(e,t,r){"use strict";r.d(t,{Ol:function(){return l},SZ:function(){return o},Zb:function(){return i},aY:function(){return d},eW:function(){return u},ll:function(){return c}});var n=r(909),a=r(151),s=r(9061);let i=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)("div",{ref:t,className:(0,s.cn)("rounded-lg border border-muted bg-card text-card-foreground shadow-sm",r),...a})});i.displayName="Card";let l=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)("div",{ref:t,className:(0,s.cn)("flex flex-col space-y-1.5 p-6",r),...a})});l.displayName="CardHeader";let c=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)("h3",{ref:t,className:(0,s.cn)("text-2xl font-semibold leading-none tracking-tight",r),...a})});c.displayName="CardTitle";let o=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)("p",{ref:t,className:(0,s.cn)("text-sm text-muted-foreground",r),...a})});o.displayName="CardDescription";let d=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)("div",{ref:t,className:(0,s.cn)("p-6 pt-0",r),...a})});d.displayName="CardContent";let u=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)("div",{ref:t,className:(0,s.cn)("flex items-center p-6 pt-0",r),...a})});u.displayName="CardFooter"},7338:function(e,t,r){"use strict";r.d(t,{g:function(){return i}});var n=r(909),a=r(151),s=r(9061);let i=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)("textarea",{className:(0,s.cn)("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",r),ref:t,...a})});i.displayName="Textarea"},9061:function(e,t,r){"use strict";r.d(t,{cn:function(){return s}});var n=r(7838),a=r(3230);function s(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return(0,a.m6)((0,n.W)(t))}}},function(e){e.O(0,[3230,7400,3050,6556,2948,4044,4928,6251,2663,1744],function(){return e(e.s=7697)}),_N_E=e.O()}]);