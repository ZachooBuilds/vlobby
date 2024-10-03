(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2157],{3438:function(e,t,r){Promise.resolve().then(r.bind(r,5112))},5112:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return w}});var s=r(909),n=r(151),o=r(1292),a=r(2557),i=r(4152),l=r(7277),d=r(8071),c=r(7955),u=r(5144),f=r(3632),m=r(1512),p=r(363),x=r(8),h=r(1908),g=r(233);console.log("Initializing ForgotPasswordConfirmationPage component");let v=i.z.object({code:i.z.string().min(6,"Verification code must be at least 6 characters"),password:i.z.string().min(8,"Password must be at least 8 characters"),confirmPassword:i.z.string().min(8,"Password must be at least 8 characters")}).refine(e=>e.password===e.confirmPassword,{message:"Passwords don't match",path:["confirmPassword"]});function w(){console.log("Rendering ForgotPasswordConfirmationPage component");let[e,t]=(0,n.useState)(!1),{client:r}=(0,l.ll)(),{toast:i}=(0,x.pm)(),w=(0,g.useRouter)();console.log("Initial state:",{isLoading:e});let j=(0,o.cI)({resolver:(0,a.F)(v),defaultValues:{code:"",password:"",confirmPassword:""}});console.log("Form initialized");let b=async e=>{console.log("Form submitted with data:",e),t(!0),console.log("Setting isLoading to true");try{let t=await r.signIn.attemptFirstFactor({strategy:"reset_password_email_code",code:e.code,password:e.password});if("complete"===t.status)i({title:"Success",description:"Your password has been reset successfully."}),w.push("/sign-in");else throw Error("Password reset failed")}catch(e){var s,n;console.error("Error during password reset process:",e),i({title:"Error",description:(null===(n=e.errors)||void 0===n?void 0:null===(s=n[0])||void 0===s?void 0:s.longMessage)||"An error occurred during the password reset process",variant:"destructive"})}finally{t(!1),console.log("Setting isLoading to false")}};return console.log("Rendering JSX"),(0,s.jsx)("div",{className:"flex items-center justify-center min-h-screen p-5 pt-20 overflow-scroll",children:(0,s.jsx)(p.E.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:.3,duration:.5},className:"w-full max-w-md",children:(0,s.jsxs)(d.Zb,{className:"flex flex-col gap-2",children:[(0,s.jsx)(d.Ol,{className:"p-2",children:(0,s.jsx)(c.o,{ratio:2,children:(0,s.jsx)(h.X,{})})}),(0,s.jsxs)(d.aY,{className:"flex flex-col gap-4",children:[(0,s.jsxs)("div",{className:"flex flex-col gap-2 w-full items-center p-2",children:[(0,s.jsx)("p",{className:"text-lg font-semibold",children:"Reset Your Password"}),(0,s.jsx)("p",{className:"text-sm text-center text-muted-foreground",children:"Enter the verification code you received and your new password."})]}),(0,s.jsx)(f.l0,{...j,children:(0,s.jsxs)("form",{onSubmit:j.handleSubmit(b),className:"space-y-4",children:[(0,s.jsx)(f.Wi,{control:j.control,name:"code",render:e=>{let{field:t}=e;return(0,s.jsxs)(f.xJ,{children:[(0,s.jsx)(f.lX,{children:"Verification Code"}),(0,s.jsx)(f.NI,{children:(0,s.jsx)(m.I,{placeholder:"Enter verification code",...t,className:"text-base"})}),(0,s.jsx)(f.zG,{})]})}}),(0,s.jsx)(f.Wi,{control:j.control,name:"password",render:e=>{let{field:t}=e;return(0,s.jsxs)(f.xJ,{children:[(0,s.jsx)(f.lX,{children:"New Password"}),(0,s.jsx)(f.NI,{children:(0,s.jsx)(m.I,{placeholder:"Enter new password",type:"password",...t,className:"text-base"})}),(0,s.jsx)(f.zG,{})]})}}),(0,s.jsx)(f.Wi,{control:j.control,name:"confirmPassword",render:e=>{let{field:t}=e;return(0,s.jsxs)(f.xJ,{children:[(0,s.jsx)(f.lX,{children:"Confirm New Password"}),(0,s.jsx)(f.NI,{children:(0,s.jsx)(m.I,{placeholder:"Confirm new password",type:"password",...t,className:"text-base"})}),(0,s.jsx)(f.zG,{})]})}}),(0,s.jsx)(u.z,{type:"submit",className:"w-full",disabled:e,children:e?"Resetting...":"Reset Password"})]})}),(0,s.jsx)(u.z,{variant:"link",onClick:()=>w.push("/sign-in"),children:"Back to Sign In"})]})]})})})}},1908:function(e,t,r){"use strict";r.d(t,{X:function(){return n}});var s=r(909);function n(){return(0,s.jsx)("svg",{viewBox:"0 0 60 60",className:" h-full w-full",children:(0,s.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 128 34",children:[(0,s.jsx)("path",{d:"M43.35 12.327 37.624 27.94h-3.802l-5.726-15.612h3.355l4.294 12.414 4.272-12.414h3.333ZM48.359 25.457h5.144v2.482h-8.276V12.327h3.132v13.13ZM60.995 28.14c-1.192 0-2.266-.26-3.22-.782a5.872 5.872 0 0 1-2.26-2.26c-.536-.968-.804-2.087-.804-3.354 0-1.268.275-2.386.827-3.355a5.828 5.828 0 0 1 2.304-2.237c.97-.537 2.05-.805 3.243-.805s2.274.268 3.243.805a5.677 5.677 0 0 1 2.282 2.237c.566.969.85 2.087.85 3.355 0 1.267-.291 2.386-.873 3.355a5.943 5.943 0 0 1-2.326 2.259c-.97.522-2.058.783-3.265.783Zm0-2.728c.567 0 1.097-.134 1.589-.403.506-.283.91-.7 1.207-1.252.299-.552.448-1.223.448-2.013 0-1.178-.313-2.08-.94-2.707-.611-.64-1.364-.961-2.259-.961-.894 0-1.647.32-2.259.961-.596.627-.894 1.529-.894 2.707s.29 2.087.872 2.729c.596.626 1.342.939 2.236.939ZM72.888 17.36c.402-.596.954-1.081 1.655-1.454.716-.373 1.528-.56 2.438-.56 1.059 0 2.013.262 2.863.784.865.522 1.543 1.267 2.035 2.236.507.955.76 2.066.76 3.333 0 1.267-.253 2.393-.76 3.377-.492.97-1.17 1.723-2.035 2.26-.85.536-1.804.805-2.863.805-.925 0-1.737-.18-2.438-.537a4.846 4.846 0 0 1-1.655-1.432v1.767h-3.132V11.388h3.132v5.972Zm6.553 4.34c0-.747-.156-1.388-.47-1.924-.298-.552-.7-.97-1.207-1.253a3.172 3.172 0 0 0-1.61-.425c-.567 0-1.104.15-1.611.447-.492.284-.895.701-1.208 1.253-.298.552-.447 1.2-.447 1.946 0 .745.149 1.394.447 1.946.313.551.716.976 1.208 1.275a3.252 3.252 0 0 0 1.61.425 3.05 3.05 0 0 0 1.61-.448c.508-.298.91-.723 1.209-1.275.313-.551.47-1.207.47-1.968ZM88.046 17.36c.403-.596.955-1.081 1.656-1.454.715-.373 1.528-.56 2.438-.56 1.058 0 2.013.262 2.863.784.864.522 1.543 1.267 2.035 2.236.507.955.76 2.066.76 3.333 0 1.267-.253 2.393-.76 3.377-.492.97-1.17 1.723-2.035 2.26-.85.536-1.805.805-2.863.805-.925 0-1.737-.18-2.438-.537a4.846 4.846 0 0 1-1.656-1.432v1.767h-3.13V11.388h3.13v5.972ZM94.6 21.7c0-.747-.157-1.388-.47-1.924-.298-.552-.7-.97-1.207-1.253a3.172 3.172 0 0 0-1.611-.425c-.567 0-1.103.15-1.61.447-.492.284-.895.701-1.208 1.253-.298.552-.448 1.2-.448 1.946 0 .745.15 1.394.448 1.946.313.551.716.976 1.208 1.275a3.252 3.252 0 0 0 1.61.425 3.05 3.05 0 0 0 1.61-.448c.507-.298.91-.723 1.208-1.275.313-.551.47-1.207.47-1.968ZM111.928 15.548 104.256 33.8h-3.332l2.684-6.174-4.966-12.078h3.512l3.198 8.656 3.244-8.656h3.332Z"}),(0,s.jsx)("path",{fill:"#5236FF",fillOpacity:".8",d:"m12.462 5.14-1.297-2.596a1.72 1.72 0 0 1 1.539-2.49h7.064c1.854 0 2.397 2.53.706 3.29L14.707 5.94a1.72 1.72 0 0 1-2.245-.8Z"}),(0,s.jsx)("path",{fill:"url(#a)",d:"M4.528 0H2.451A1.72 1.72 0 0 0 .914 2.493L13.2 26.943c.634 1.263 2.437 1.265 3.073.003l9.197-18.23c.818-1.622-1.107-3.24-2.564-2.156l-8.583 6.39a1.72 1.72 0 0 1-2.567-.61L6.068.951A1.72 1.72 0 0 0 4.528 0Z"}),(0,s.jsx)("path",{fill:"url(#b)",d:"M127.113 28.794a4.629 4.629 0 1 1-9.257 0 4.629 4.629 0 0 1 9.257 0Z"}),(0,s.jsx)("path",{fill:"url(#c)",d:"M125.08 20.693a2.158 2.158 0 1 1-4.316 0 2.158 2.158 0 0 1 4.316 0Z"}),(0,s.jsx)("path",{fill:"url(#d)",d:"M127.272 23.482a1.096 1.096 0 1 1-2.192 0 1.096 1.096 0 0 1 2.192 0Z"}),(0,s.jsxs)("defs",{children:[(0,s.jsxs)("linearGradient",{id:"a",x1:"34.402",x2:"37.075",y1:"3.121",y2:"34.521",gradientUnits:"userSpaceOnUse",children:[(0,s.jsx)("stop",{stopColor:"#5236FF"}),(0,s.jsx)("stop",{offset:"1",stopColor:"#312099"})]}),(0,s.jsxs)("linearGradient",{id:"b",x1:"126.176",x2:"126.176",y1:"22.387",y2:"24.578",gradientUnits:"userSpaceOnUse",children:[(0,s.jsx)("stop",{stopColor:"#5236FF"}),(0,s.jsx)("stop",{offset:"1",stopColor:"#33229F"})]}),(0,s.jsxs)("linearGradient",{id:"c",x1:"126.176",x2:"126.176",y1:"22.387",y2:"24.578",gradientUnits:"userSpaceOnUse",children:[(0,s.jsx)("stop",{stopColor:"#5236FF"}),(0,s.jsx)("stop",{offset:"1",stopColor:"#33229F"})]}),(0,s.jsxs)("linearGradient",{id:"d",x1:"126.176",x2:"126.176",y1:"22.387",y2:"24.578",gradientUnits:"userSpaceOnUse",children:[(0,s.jsx)("stop",{stopColor:"#5236FF"}),(0,s.jsx)("stop",{offset:"1",stopColor:"#33229F"})]})]})]})})}},7955:function(e,t,r){"use strict";r.d(t,{o:function(){return s}});let s=r(8766).f},5144:function(e,t,r){"use strict";r.d(t,{d:function(){return l},z:function(){return d}});var s=r(909),n=r(151),o=r(1875),a=r(6271),i=r(9061);let l=(0,a.j)("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),d=n.forwardRef((e,t)=>{let{className:r,variant:n,size:a,asChild:d=!1,...c}=e,u=d?o.g7:"button";return(0,s.jsx)(u,{className:(0,i.cn)(l({variant:n,size:a,className:r})),ref:t,...c})});d.displayName="Button"},8071:function(e,t,r){"use strict";r.d(t,{Ol:function(){return i},SZ:function(){return d},Zb:function(){return a},aY:function(){return c},eW:function(){return u},ll:function(){return l}});var s=r(909),n=r(151),o=r(9061);let a=n.forwardRef((e,t)=>{let{className:r,...n}=e;return(0,s.jsx)("div",{ref:t,className:(0,o.cn)("rounded-lg border border-muted bg-card text-card-foreground shadow-sm",r),...n})});a.displayName="Card";let i=n.forwardRef((e,t)=>{let{className:r,...n}=e;return(0,s.jsx)("div",{ref:t,className:(0,o.cn)("flex flex-col space-y-1.5 p-6",r),...n})});i.displayName="CardHeader";let l=n.forwardRef((e,t)=>{let{className:r,...n}=e;return(0,s.jsx)("h3",{ref:t,className:(0,o.cn)("text-2xl font-semibold leading-none tracking-tight",r),...n})});l.displayName="CardTitle";let d=n.forwardRef((e,t)=>{let{className:r,...n}=e;return(0,s.jsx)("p",{ref:t,className:(0,o.cn)("text-sm text-muted-foreground",r),...n})});d.displayName="CardDescription";let c=n.forwardRef((e,t)=>{let{className:r,...n}=e;return(0,s.jsx)("div",{ref:t,className:(0,o.cn)("p-6 pt-0",r),...n})});c.displayName="CardContent";let u=n.forwardRef((e,t)=>{let{className:r,...n}=e;return(0,s.jsx)("div",{ref:t,className:(0,o.cn)("flex items-center p-6 pt-0",r),...n})});u.displayName="CardFooter"},3632:function(e,t,r){"use strict";r.d(t,{l0:function(){return u},NI:function(){return v},pf:function(){return w},Wi:function(){return m},xJ:function(){return h},lX:function(){return g},zG:function(){return j}});var s=r(909),n=r(151),o=r(1875),a=r(1292),i=r(9061),l=r(3598);let d=(0,r(6271).j)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),c=n.forwardRef((e,t)=>{let{className:r,...n}=e;return(0,s.jsx)(l.f,{ref:t,className:(0,i.cn)(d(),r),...n})});c.displayName=l.f.displayName;let u=a.RV,f=n.createContext({}),m=e=>{let{...t}=e;return(0,s.jsx)(f.Provider,{value:{name:t.name},children:(0,s.jsx)(a.Qr,{...t})})},p=()=>{let e=n.useContext(f),t=n.useContext(x),{getFieldState:r,formState:s}=(0,a.Gc)(),o=r(e.name,s);if(!e)throw Error("useFormField should be used within <FormField>");let{id:i}=t;return{id:i,name:e.name,formItemId:"".concat(i,"-form-item"),formDescriptionId:"".concat(i,"-form-item-description"),formMessageId:"".concat(i,"-form-item-message"),...o}},x=n.createContext({}),h=n.forwardRef((e,t)=>{let{className:r,...o}=e,a=n.useId();return(0,s.jsx)(x.Provider,{value:{id:a},children:(0,s.jsx)("div",{ref:t,className:(0,i.cn)("space-y-2",r),...o})})});h.displayName="FormItem";let g=n.forwardRef((e,t)=>{let{className:r,...n}=e,{error:o,formItemId:a}=p();return(0,s.jsx)(c,{ref:t,className:(0,i.cn)(o&&"text-destructive",r),htmlFor:a,...n})});g.displayName="FormLabel";let v=n.forwardRef((e,t)=>{let{...r}=e,{error:n,formItemId:a,formDescriptionId:i,formMessageId:l}=p();return(0,s.jsx)(o.g7,{ref:t,id:a,"aria-describedby":n?"".concat(i," ").concat(l):"".concat(i),"aria-invalid":!!n,...r})});v.displayName="FormControl";let w=n.forwardRef((e,t)=>{let{className:r,...n}=e,{formDescriptionId:o}=p();return(0,s.jsx)("p",{ref:t,id:o,className:(0,i.cn)("text-sm text-muted-foreground",r),...n})});w.displayName="FormDescription";let j=n.forwardRef((e,t)=>{let{className:r,children:n,...o}=e,{error:a,formMessageId:l}=p(),d=a?String(null==a?void 0:a.message):n;return d?(0,s.jsx)("p",{ref:t,id:l,className:(0,i.cn)("text-sm font-medium text-destructive",r),...o,children:d}):null});j.displayName="FormMessage"},1512:function(e,t,r){"use strict";r.d(t,{I:function(){return a}});var s=r(909),n=r(151),o=r(9061);let a=n.forwardRef((e,t)=>{let{className:r,type:n,...a}=e;return(0,s.jsx)("input",{type:n,className:(0,o.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",r),ref:t,...a})});a.displayName="Input"},8:function(e,t,r){"use strict";r.d(t,{pm:function(){return f}});var s=r(151);let n=0,o=new Map,a=e=>{if(o.has(e))return;let t=setTimeout(()=>{o.delete(e),c({type:"REMOVE_TOAST",toastId:e})},1e6);o.set(e,t)},i=(e,t)=>{switch(t.type){case"ADD_TOAST":return{...e,toasts:[t.toast,...e.toasts].slice(0,1)};case"UPDATE_TOAST":return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case"DISMISS_TOAST":{let{toastId:r}=t;return r?a(r):e.toasts.forEach(e=>{a(e.id)}),{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,open:!1}:e)}}case"REMOVE_TOAST":if(void 0===t.toastId)return{...e,toasts:[]};return{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)}}},l=[],d={toasts:[]};function c(e){d=i(d,e),l.forEach(e=>{e(d)})}function u(e){let{...t}=e,r=(n=(n+1)%Number.MAX_SAFE_INTEGER).toString(),s=()=>c({type:"DISMISS_TOAST",toastId:r});return c({type:"ADD_TOAST",toast:{...t,id:r,open:!0,onOpenChange:e=>{e||s()}}}),{id:r,dismiss:s,update:e=>c({type:"UPDATE_TOAST",toast:{...e,id:r}})}}function f(){let[e,t]=s.useState(d);return s.useEffect(()=>(l.push(t),()=>{let e=l.indexOf(t);e>-1&&l.splice(e,1)}),[e]),{...e,toast:u,dismiss:e=>c({type:"DISMISS_TOAST",toastId:e})}}},9061:function(e,t,r){"use strict";r.d(t,{cn:function(){return o}});var s=r(7838),n=r(3230);function o(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return(0,n.m6)((0,s.W)(t))}},8766:function(e,t,r){"use strict";r.d(t,{f:function(){return i}});var s=r(151),n=r(3553),o=r(909),a=s.forwardRef((e,t)=>{let{ratio:r=1,style:s,...a}=e;return(0,o.jsx)("div",{style:{position:"relative",width:"100%",paddingBottom:`${100/r}%`},"data-radix-aspect-ratio-wrapper":"",children:(0,o.jsx)(n.WV.div,{...a,ref:t,style:{...s,position:"absolute",top:0,right:0,bottom:0,left:0}})})});a.displayName="AspectRatio";var i=a}},function(e){e.O(0,[3230,7400,7801,9811,6251,2663,1744],function(){return e(e.s=3438)}),_N_E=e.O()}]);