var JSTACK=JSTACK||{};JSTACK.VERSION="0.1";JSTACK.AUTHORS="GING";JSTACK.Comm=function(c,e){var g;g=function(c,d,a,b,f,i){var g,j;g=new XMLHttpRequest;g.open(c,d,!0);g.setRequestHeader("Content-Type","application/json");g.setRequestHeader("Accept","application/json");g.onreadystatechange=function(){if(4===g.readyState)switch(g.status){case 100:case 200:case 201:case 202:case 203:case 204:case 205:j=e;g.responseText!==e&&""!==g.responseText&&(j=JSON.parse(g.responseText));f(j);break;case 400:i("400 Bad Request");break;case 401:i("401 Unauthorized");break;case 403:i("403 Forbidden");
break;default:i(g.status+" Error")}};b!==e&&g.setRequestHeader("X-Auth-Token",b);a!==e?(c=JSON.stringify(a),g.send(c)):g.send()};return{get:function(c,d,a,b){g("GET",c,e,d,a,b)},post:function(c,d,a,b,f){g("POST",c,d,a,b,f)},put:function(c,d,a,b,f){g("PUT",c,d,a,b,f)},del:function(c,d,a,b){g("DELETE",c,e,d,a,b)}}}(JSTACK);JSTACK.Utils=function(c){var e,g;e=function(c){var d="",a,b,c=c.replace(/\r\n/g,"\n");for(a=0;a<c.length;a+=1)b=c.charCodeAt(a),128>b?d+=String.fromCharCode(b):(127<b&&2048>b?d+=String.fromCharCode(b>>6|192):(d+=String.fromCharCode(b>>12|224),d+=String.fromCharCode(b>>6&63|128)),d+=String.fromCharCode(b&63|128));return d};g=function(c){for(var d="",a=0,b=0,f=0,i=0;a<c.length;)b=c.charCodeAt(a),128>b?(d+=String.fromCharCode(b),a+=1):191<b&&224>b?(f=c.charCodeAt(a+1),d+=String.fromCharCode((b&31)<<
6|f&63),a+=2):(f=c.charCodeAt(a+1),i=c.charCodeAt(a+2),d+=String.fromCharCode((b&15)<<12|(f&63)<<6|i&63),a+=3);return d};return{encode:function(g){for(var d="",a,b,f,i,l,j,k=0,g=e(g);k<g.length;)a=g.charCodeAt(k+=1),b=g.charCodeAt(k+=1),f=g.charCodeAt(k+=1),i=a>>2,a=(a&3)<<4|b>>4,l=(b&15)<<2|f>>6,j=f&63,isNaN(b)?l=j=64:isNaN(f)&&(j=64),d=d+c.Utils.keyStr.charAt(i)+Base64.keyStr.charAt(a)+c.Utils.keyStr.charAt(l)+Base64.keyStr.charAt(j);return d},decode:function(e){for(var d="",a,b,f,i,l,j=0,e=e.replace(/[^A-Za-z0-9\+\/\=]/g,
"");j<e.length;)a=c.Utils.keyStr.indexOf(e.charAt(j+=1)),b=c.Utils.keyStr.indexOf(e.charAt(j+=1)),i=c.Utils.keyStr.indexOf(e.charAt(j+=1)),l=c.Utils.keyStr.indexOf(e.charAt(j+=1)),a=a<<2|b>>4,b=(b&15)<<4|i>>2,f=(i&3)<<6|l,d+=String.fromCharCode(a),64!==i&&(d+=String.fromCharCode(b)),64!==l&&(d+=String.fromCharCode(f));return d=g(d)}}}(JSTACK);JSTACK.Keystone=function(c,e){var g,h;h={DISCONNECTED:0,AUTHENTICATING:1,AUTHENTICATED:2,AUTHENTICATION_ERROR:3};g={url:e,currentstate:e,access:e,token:e};return{STATES:h,params:g,init:function(c){g.url=c;g.access=e;g.token=e;g.currentstate=h.DISCONNECTED},authenticate:function(d,a,b,f,i,l){var j={},j=b!==e?{auth:{token:{id:b}}}:{auth:{passwordCredentials:{username:d,password:a}}};f!==e&&(j.auth.tenantId=f);g.currentstate=h.AUTHENTICATING;c.Comm.post(g.url+"tokens",j,e,function(a){g.currentstate=
c.Keystone.STATES.AUTHENTICATED;g.access=a.access;g.token=g.access.token.id;i!==e&&i(a)},function(a){g.currentstate=h.AUTHENTICATION_ERROR;l(a)})},gettenants:function(d){g.currentstate===c.Keystone.STATES.AUTHENTICATED&&c.Comm.get(g.url+"tenants",g.token,function(a){d!==e&&d(a)},function(a){throw Error(a);})},getservice:function(c){var a,b;if(g.currentstate!==h.AUTHENTICATED)return e;for(a in g.access.serviceCatalog)if(g.access.serviceCatalog[a]!==e&&(b=g.access.serviceCatalog[a],c===b.type))return b;
return e},getservicelist:function(){return g.currentstate!==h.AUTHENTICATED?e:g.access.serviceCatalog}}}(JSTACK);JSTACK.Nova=function(c,e){var g,h,d;g=e;h=function(){return c.Keystone!==e&&c.Keystone.params.currentstate===c.Keystone.STATES.AUTHENTICATED?(g=c.Keystone.getservice("compute").endpoints[0].adminURL,!0):!1};d=function(a,b,f,i){h()&&(a=g+"/servers/"+a+"/action",c.Comm.post(a,b,c.Keystone.params.token,function(a){i!==e&&i(a)},function(a){throw Error(a);}))};return{getserverlist:function(a,b,f){var i;h()&&(i=g+"/servers",a!==e&a&&(i+="/detail"),b&&(i+="?all_tenants="+b),c.Comm.get(i,c.Keystone.params.token,
function(a){f!==e&&f(a)},function(a){throw Error(a);}))},getserverdetail:function(a,b){var f;h()&&(f=g+"/servers/"+a,c.Comm.get(f,c.Keystone.params.token,function(a){b!==e&&b(a)},function(a){throw Error(a);}))},getserverips:function(a,b,f){h()&&(a=g+"/servers/"+a+"/ips",b!==e&&(a+="/"+b),c.Comm.get(a,c.Keystone.params.token,function(a){f!==e&&f(a)},function(a){throw Error(a);}))},updateserver:function(a,b,f){h()&&(a=g+"/servers/"+a,b!==e&&c.Comm.put(a,{server:{name:b}},c.Keystone.params.token,function(a){f!==
e&&f(a)},function(a){throw Error(a);}))},createserver:function(a,b,f,i,d,j,k,m,n,o){var q=[],p;if(h()){a={server:{name:a,imageRef:b,flavorRef:f}};i!==e&&(a.server.key_name=i);d!==e&&(a.server.user_data=c.Utils.encode(d));if(j!==e){for(p in j)j[p]!==e&&(i={name:j[p]},q.push(i));a.server.security_groups=q}k===e&&(k=1);a.server.min_count=k;m===e&&(m=1);a.server.max_count=m;n!==e&&(a.server.availability_zone=c.Utils.encode(n));c.Comm.post(g+"/servers",a,c.Keystone.params.token,function(a){o!==e&&o(a)},
function(a){throw Error(a);})}},deleteserver:function(a,b){var f;h()&&(f=g+"/servers/"+a,c.Comm.del(f,c.Keystone.params.token,function(a){b!==e&&b(a)},function(a){throw Error(a);}))},changepasswordserver:function(a,b,f){b!==e&&d(a,{changePassword:{adminPass:b}},f)},rebootserverhard:function(a,b){d(a,{reboot:{type:"HARD"}},b)},rebootserversoft:function(a,b){d(a,{reboot:{type:"SOFT"}},b)},resizeserver:function(a,b,f){d(a,{resize:{flavorRef:b}},f)},confirmresizedserver:function(a,b){d(a,{confirmResize:null},
b)},revertresizedserver:function(a,b){d(a,{revertResize:null},b)},startserver:function(a,b){d(a,{"os-start":null},b)},stopserver:function(a,b){d(a,{"os-stop":null},b)},pauseserver:function(a,b){d(a,{pause:null},b)},unpauseserver:function(a,b){d(a,{unpause:null},b)},suspendserver:function(a,b){d(a,{suspend:null},b)},resumeserver:function(a,b){d(a,{resume:null},b)},createimage:function(a,b,f,c){b={createImage:{name:b}};b.createImage.metadata={};f!==e&&(b.createImage.metadata=f);d(a,b,c)},getflavorlist:function(a,
b){var f;h()&&(f=g+"/flavors",a!==e&a&&(f+="/detail"),c.Comm.get(f,c.Keystone.params.token,function(a){b!==e&&b(a)},function(a){throw Error(a);}))},getflavordetail:function(a,b){var f;h()&&(f=g+"/flavors/"+a,c.Comm.get(f,c.Keystone.params.token,function(a){b!==e&&b(a)},function(a){throw Error(a);}))},createflavor:function(a,b,f,d,l,j,k,m,n){var o;h()&&(o=g+"/flavors",a={flavor:{name:a,ram:b,vcpus:f,disk:d,id:l,swap:0,"OS-FLV-EXT-DATA:ephemeral":0,rxtx_factor:0}},j!==e&&(a.flavor["OS-FLV-EXT-DATA:ephemeral"]=
j),k!==e&&(a.flavor.swap=k),m!==e&&(a.flavor.rxtx_factor=m),c.Comm.post(o,a,c.Keystone.params.token,function(a){n!==e&&n(a)},function(a){throw Error(a);}))},deleteflavor:function(a,b){var f;h()&&(f=g+"/flavors/"+a,c.Comm.del(f,c.Keystone.params.token,function(a){b!==e&&b(a)},function(a){throw Error(a);}))},getimagelist:function(a,b){var f;h()&&(f=g+"/images",a!==e&a&&(f+="/detail"),c.Comm.get(f,c.Keystone.params.token,function(a){b!==e&&b(a)},function(a){throw Error(a);}))},getimagedetail:function(a,
b){var f;h()&&(f=g+"/images/"+a,c.Comm.get(f,c.Keystone.params.token,function(a){b!==e&&b(a)},function(a){throw Error(a);}))},deleteimage:function(a,b){var f;h()&&(f=g+"/images/"+a,c.Comm.del(f,c.Keystone.params.token,function(a){b!==e&&b(a)},function(a){throw Error(a);}))},getkeypairlist:function(a){var b;h()&&(b=g+"/os-keypairs",c.Comm.get(b,c.Keystone.params.token,function(b){a!==e&&a(b)},function(a){throw Error(a);}))},createkeypair:function(a,b,f){var d;h()&&(d=g+"/os-keypairs",a={keypair:{name:a}},
b!==e&&(a.keypair.public_key=b),c.Comm.post(d,a,c.Keystone.params.token,function(a){f!==e&&f(a)},function(a){throw Error(a);}))},deletekeypair:function(a,b){var f;h()&&(f=g+"/os-keypairs/"+a,c.Comm.del(f,c.Keystone.params.token,function(a){b!==e&&b(a)},function(a){throw Error(a);}))},getvncconsole:function(a,b,f){if(h()){if(b===e||!b)b="novnc";d(a,{"os-getVNCConsole":{type:b}},null,f)}},getconsoleoutput:function(a,b,f){if(h()){if(b===e||!b)b=35;d(a,{"os-getConsoleOutput":{length:b}},null,f)}},getattachedvolumes:function(a,
b){var f;h()&&(f=g+"/servers/"+a+"/os-volume_attachments",c.Comm.get(f,c.Keystone.params.token,function(a){b!==e&&b(a)},function(a){throw Error(a);}))},attachvolume:function(a,b,f,d){h()&&(a=g+"/servers/"+a+"/os-volume_attachments",b===e||f===e||c.Comm.post(a,{volumeAttachment:{volumeId:b,device:f}},c.Keystone.params.token,function(a){d!==e&&d(a)},function(a){throw Error(a);}))},detachvolume:function(a,b,f){h()&&(a=g+"/servers/"+a+"/os-volume_attachments/"+b,b!==e&&c.Comm.del(a,c.Keystone.params.token,
function(a){f!==e&&f(a)},function(a){throw Error(a);}))},getattachedvolume:function(a,b,f){h()&&(a=g+"/servers/"+a+"/os-volume_attachments/"+b,b!==e&&c.Comm.get(a,c.Keystone.params.token,function(a){f!==e&&f(a)},function(a){throw Error(a);}))}}}(JSTACK);JSTACK.Nova.Volume=function(c,e){var g,h;g=e;h=function(){return c.Keystone!==e&&c.Keystone.params.currentstate===c.Keystone.STATES.AUTHENTICATED?(g=c.Keystone.getservice("volume").endpoints[0].adminURL,!0):!1};return{getvolumelist:function(d,a){var b;h()&&(b=g+"/volumes",d!==e&d&&(b+="/detail"),c.Comm.get(b,c.Keystone.params.token,function(b){a!==e&&a(b)},function(a){throw Error(a);}))},createvolume:function(d,a,b,f){h()&&(d={volume:{size:d}},a!==e&&(d.volume.display_name=a),b!==e&&(d.volume.display_description=
b),c.Comm.post(g+"/volumes",d,c.Keystone.params.token,function(a){f!==e&&f(a)},function(a){throw Error(a);}))},deletevolume:function(d,a){var b;h()&&(b=g+"/volumes/"+d,c.Comm.del(b,c.Keystone.params.token,function(b){a!==e&&a(b)},function(a){throw Error(a);}))},getvolume:function(d,a){var b;h()&&(b=g+"/volumes/"+d,c.Comm.get(b,c.Keystone.params.token,function(b){a!==e&&a(b)},function(a){throw Error(a);}))},getsnapshotlist:function(d,a){var b;h()&&(b=g+"/snapshots",d!==e&&d&&(b+="/detail"),c.Comm.get(b,
c.Keystone.params.token,function(b){a!==e&&a(b)},function(a){throw Error(a);}))},createsnapshot:function(d,a,b,f){h()&&(d={snapshot:{volume_id:d,force:!0}},a!==e&&(d.snapshot.display_name=a),b!==e&&(d.snapshot.display_description=b),c.Comm.post(g+"/snapshots",d,c.Keystone.params.token,function(a){f!==e&&f(a)},function(a){throw Error(a);}))},deletesnapshot:function(d,a){var b;h()&&(b=g+"/snapshots/"+d,c.Comm.del(b,c.Keystone.params.token,function(b){a!==e&&a(b)},function(a){throw Error(a);}))},getsnapshot:function(d,
a){var b;h()&&(b=g+"/snapshots/"+d,c.Comm.get(b,c.Keystone.params.token,function(b){a!==e&&a(b)},function(a){throw Error(a);}))}}}(JSTACK);JSTACK.Glance=function(c,e){var g,h;g=e;h=function(){return c.Keystone!==e&&c.Keystone.params.currentstate===c.Keystone.STATES.AUTHENTICATED?(g=c.Keystone.getservice("image").endpoints[0].adminURL,!0):!1};return{getimagelist:function(d,a){var b;h()&&(b=g+"/images",d!==e&&d&&(b+="/detail"),c.Comm.get(b,c.Keystone.params.token,function(b){a!==e&&a(b)},function(a){throw Error(a);}))}}}(JSTACK);
