var JSTACK=JSTACK||{};JSTACK.VERSION="0.1";JSTACK.AUTHORS="GING";JSTACK.Comm=function(c,f){var g;g=function(c,h,d,a,b,e){var i,g;i=new XMLHttpRequest;i.open(c,h,!0);i.setRequestHeader("Content-Type","application/json");i.setRequestHeader("Accept","application/json");i.onreadystatechange=function(){if(4===i.readyState)switch(i.status){case 100:case 200:case 201:case 202:case 203:case 204:case 205:g=f;i.responseText!==f&&""!==i.responseText&&(g=JSON.parse(i.responseText));b(g);break;case 400:e("400 Bad Request");break;case 401:e("401 Unauthorized");break;case 403:e("403 Forbidden");
break;default:e(i.status+" Error")}};a!==f&&i.setRequestHeader("X-Auth-Token",a);d!==f?(c=JSON.stringify(d),i.send(c)):i.send()};return{get:function(c,h,d,a){g("GET",c,f,h,d,a)},post:function(c,h,d,a,b){g("POST",c,h,d,a,b)},put:function(c,h,d,a,b){g("PUT",c,h,d,a,b)},del:function(c,h,d,a){g("DELETE",c,f,h,d,a)}}}(JSTACK);JSTACK.Utils=function(c){var f,g;f=function(c){var h="",d,a,c=c.replace(/\r\n/g,"\n");for(d=0;d<c.length;d+=1)a=c.charCodeAt(d),128>a?h+=String.fromCharCode(a):(127<a&&2048>a?h+=String.fromCharCode(a>>6|192):(h+=String.fromCharCode(a>>12|224),h+=String.fromCharCode(a>>6&63|128)),h+=String.fromCharCode(a&63|128));return h};g=function(c){for(var h="",d=0,a=0,b=0,e=0;d<c.length;)a=c.charCodeAt(d),128>a?(h+=String.fromCharCode(a),d+=1):191<a&&224>a?(b=c.charCodeAt(d+1),h+=String.fromCharCode((a&31)<<
6|b&63),d+=2):(b=c.charCodeAt(d+1),e=c.charCodeAt(d+2),h+=String.fromCharCode((a&15)<<12|(b&63)<<6|e&63),d+=3);return h};return{encode:function(g){for(var h="",d,a,b,e,i,k,n=0,g=f(g);n<g.length;)d=g.charCodeAt(n+=1),a=g.charCodeAt(n+=1),b=g.charCodeAt(n+=1),e=d>>2,d=(d&3)<<4|a>>4,i=(a&15)<<2|b>>6,k=b&63,isNaN(a)?i=k=64:isNaN(b)&&(k=64),h=h+c.Utils.keyStr.charAt(e)+Base64.keyStr.charAt(d)+c.Utils.keyStr.charAt(i)+Base64.keyStr.charAt(k);return h},decode:function(f){for(var h="",d,a,b,e,i,k=0,f=f.replace(/[^A-Za-z0-9\+\/\=]/g,
"");k<f.length;)d=c.Utils.keyStr.indexOf(f.charAt(k+=1)),a=c.Utils.keyStr.indexOf(f.charAt(k+=1)),e=c.Utils.keyStr.indexOf(f.charAt(k+=1)),i=c.Utils.keyStr.indexOf(f.charAt(k+=1)),d=d<<2|a>>4,a=(a&15)<<4|e>>2,b=(e&3)<<6|i,h+=String.fromCharCode(d),64!==e&&(h+=String.fromCharCode(a)),64!==i&&(h+=String.fromCharCode(b));return h=g(h)}}}(JSTACK);JSTACK.Keystone=function(c,f){var g,j;j={DISCONNECTED:0,AUTHENTICATING:1,AUTHENTICATED:2,AUTHENTICATION_ERROR:3};g={url:f,currentstate:f,access:f,token:f};return{STATES:j,params:g,init:function(c,d){console.log("Admin URL"+d);g.url=c;g.adminUrl=d;g.access=f;g.token=f;g.currentstate=j.DISCONNECTED},authenticate:function(h,d,a,b,e,i){var k={},k=a!==f?{auth:{token:{id:a}}}:{auth:{passwordCredentials:{username:h,password:d}}};b!==f&&(k.auth.tenantId=b);g.currentstate=j.AUTHENTICATING;c.Comm.post(g.url+
"tokens",k,f,function(a){g.currentstate=c.Keystone.STATES.AUTHENTICATED;g.access=a.access;g.token=g.access.token.id;e!==f&&e(a)},function(a){g.currentstate=j.AUTHENTICATION_ERROR;i(a)})},gettenants:function(h){g.currentstate===c.Keystone.STATES.AUTHENTICATED&&c.Comm.get(g.url+"tenants",g.token,function(c){h!==f&&h(c)},function(c){throw Error(c);})},getservice:function(c){var d,a;if(g.currentstate!==j.AUTHENTICATED)return f;for(d in g.access.serviceCatalog)if(g.access.serviceCatalog[d]!==f&&(a=g.access.serviceCatalog[d],
c===a.type))return a;return f},getservicelist:function(){return g.currentstate!==j.AUTHENTICATED?f:g.access.serviceCatalog},createuser:function(h,d,a,b,e,i,f){g.currentstate===c.Keystone.STATES.AUTHENTICATED&&c.Comm.post(g.adminUrl+"users",{user:{name:h,password:d,tenantId:a,email:b,enabled:e}},g.token,i,f)},getusers:function(h,d,a){if(g.currentstate===c.Keystone.STATES.AUTHENTICATED){var b="",b=h!==f?g.adminUrl+"tenants/"+h+"/users":g.adminUrl+"users";c.Comm.get(b,g.token,d,a)}},getuser:function(f,
d,a){g.currentstate===c.Keystone.STATES.AUTHENTICATED&&c.Comm.get(g.adminUrl+"users/"+f,g.token,d,a)},deleteuser:function(f,d,a){g.currentstate===c.Keystone.STATES.AUTHENTICATED&&c.Comm.del(g.adminUrl+"users/"+f,g.token,d,a)},getuserroles:function(h,d,a,b){if(g.currentstate===c.Keystone.STATES.AUTHENTICATED){var e="",e=d!==f?g.adminUrl+"tenants/"+d+"/users/"+h+"/roles":g.adminUrl+"users/"+h+"/roles";c.Comm.get(e,g.token,a,b)}},getroles:function(f,d){g.currentstate===c.Keystone.STATES.AUTHENTICATED&&
c.Comm.get(g.adminUrl+"OS-KSADM/roles",g.token,f,d)},adduserrole:function(h,d,a,b,e){if(g.currentstate===c.Keystone.STATES.AUTHENTICATED){var i="",i=a!==f?g.adminUrl+"tenants/"+a+"/users/"+h+"/roles/OS-KSADM/"+d:g.adminUrl+"users/"+h+"/roles/OS-KSADM/"+d;c.Comm.put(i,{},g.token,b,e)}},removeuserrole:function(h,d,a,b,e){if(g.currentstate===c.Keystone.STATES.AUTHENTICATED){var i="",i=a!==f?g.adminUrl+"tenants/"+a+"/users/"+h+"/roles/OS-KSADM/"+d:g.adminUrl+"users/"+h+"/roles/OS-KSADM/"+d;c.Comm.del(i,
g.token,b,e)}},createtenant:function(f,d,a,b,e){g.currentstate===c.Keystone.STATES.AUTHENTICATED&&c.Comm.post(g.adminUrl+"tenants",{tenant:{name:f,description:d,enabled:a}},g.token,b,e)},deletetenant:function(f,d,a){g.currentstate===c.Keystone.STATES.AUTHENTICATED&&c.Comm.del(g.adminUrl+"tenants"+f,data,g.token,d,a)}}}(JSTACK);JSTACK.Nova=function(c,f){var g,j,h,d;g=f;j="publicURL";h=function(){return c.Keystone!==f&&c.Keystone.params.currentstate===c.Keystone.STATES.AUTHENTICATED?(g=c.Keystone.getservice("compute").endpoints[0][j],!0):!1};d=function(a,b,e,i){h()&&(a=g+"/servers/"+a+"/action",c.Comm.post(a,b,c.Keystone.params.token,function(a){i!==f&&i(a)},function(a){throw Error(a);}))};return{configure:function(a){if("adminURL"===a||"internalURL"===a||"publicURL"===a)j=a},getserverlist:function(a,b,e){var i;h()&&(i=g+
"/servers",a!==f&&a&&(i+="/detail"),b&&(i+="?all_tenants="+b),c.Comm.get(i,c.Keystone.params.token,function(a){e!==f&&e(a)},function(a){throw Error(a);}))},getserverdetail:function(a,b){var e;h()&&(e=g+"/servers/"+a,c.Comm.get(e,c.Keystone.params.token,function(a){b!==f&&b(a)},function(a){throw Error(a);}))},getserverips:function(a,b,e){h()&&(a=g+"/servers/"+a+"/ips",b!==f&&(a+="/"+b),c.Comm.get(a,c.Keystone.params.token,function(a){e!==f&&e(a)},function(a){throw Error(a);}))},updateserver:function(a,
b,e){h()&&(a=g+"/servers/"+a,b!==f&&c.Comm.put(a,{server:{name:b}},c.Keystone.params.token,function(a){e!==f&&e(a)},function(a){throw Error(a);}))},createserver:function(a,b,e,i,d,j,m,l,o,p){var r=[],q;if(h()){a={server:{name:a,imageRef:b,flavorRef:e}};i!==f&&(a.server.key_name=i);d!==f&&(a.server.user_data=c.Utils.encode(d));if(j!==f){for(q in j)j[q]!==f&&(i={name:j[q]},r.push(i));a.server.security_groups=r}m===f&&(m=1);a.server.min_count=m;l===f&&(l=1);a.server.max_count=l;o!==f&&(a.server.availability_zone=
c.Utils.encode(o));c.Comm.post(g+"/servers",a,c.Keystone.params.token,function(a){p!==f&&p(a)},function(a){throw Error(a);})}},deleteserver:function(a,b){var e;h()&&(e=g+"/servers/"+a,c.Comm.del(e,c.Keystone.params.token,function(a){b!==f&&b(a)},function(a){throw Error(a);}))},changepasswordserver:function(a,b,e){b!==f&&d(a,{changePassword:{adminPass:b}},e)},rebootserverhard:function(a,b){d(a,{reboot:{type:"HARD"}},b)},rebootserversoft:function(a,b){d(a,{reboot:{type:"SOFT"}},b)},resizeserver:function(a,
b,e){d(a,{resize:{flavorRef:b}},e)},confirmresizedserver:function(a,b){d(a,{confirmResize:null},b)},revertresizedserver:function(a,b){d(a,{revertResize:null},b)},startserver:function(a,b){d(a,{"os-start":null},b)},stopserver:function(a,b){d(a,{"os-stop":null},b)},pauseserver:function(a,b){d(a,{pause:null},b)},unpauseserver:function(a,b){d(a,{unpause:null},b)},suspendserver:function(a,b){d(a,{suspend:null},b)},resumeserver:function(a,b){d(a,{resume:null},b)},createimage:function(a,b,e,c){b={createImage:{name:b}};
b.createImage.metadata={};e!==f&&(b.createImage.metadata=e);d(a,b,c)},getflavorlist:function(a,b){var e;h()&&(e=g+"/flavors",a!==f&&a&&(e+="/detail"),c.Comm.get(e,c.Keystone.params.token,function(a){b!==f&&b(a)},function(a){throw Error(a);}))},getflavordetail:function(a,b){var e;h()&&(e=g+"/flavors/"+a,c.Comm.get(e,c.Keystone.params.token,function(a){b!==f&&b(a)},function(a){throw Error(a);}))},createflavor:function(a,b,e,d,k,j,m,l,o){var p;h()&&(p=g+"/flavors",a={flavor:{name:a,ram:b,vcpus:e,disk:d,
id:k,swap:0,"OS-FLV-EXT-DATA:ephemeral":0,rxtx_factor:0}},j!==f&&(a.flavor["OS-FLV-EXT-DATA:ephemeral"]=j),m!==f&&(a.flavor.swap=m),l!==f&&(a.flavor.rxtx_factor=l),c.Comm.post(p,a,c.Keystone.params.token,function(a){o!==f&&o(a)},function(a){throw Error(a);}))},deleteflavor:function(a,b){var e;h()&&(e=g+"/flavors/"+a,c.Comm.del(e,c.Keystone.params.token,function(a){b!==f&&b(a)},function(a){throw Error(a);}))},getimagelist:function(a,b){var e;h()&&(e=g+"/images",a!==f&&a&&(e+="/detail"),c.Comm.get(e,
c.Keystone.params.token,function(a){b!==f&&b(a)},function(a){throw Error(a);}))},getimagedetail:function(a,b){var e;h()&&(e=g+"/images/"+a,c.Comm.get(e,c.Keystone.params.token,function(a){b!==f&&b(a)},function(a){throw Error(a);}))},deleteimage:function(a,b){var e;h()&&(e=g+"/images/"+a,c.Comm.del(e,c.Keystone.params.token,function(a){b!==f&&b(a)},function(a){throw Error(a);}))},getkeypairlist:function(a){var b;h()&&(b=g+"/os-keypairs",c.Comm.get(b,c.Keystone.params.token,function(b){a!==f&&a(b)},
function(a){throw Error(a);}))},createkeypair:function(a,b,e){var d;h()&&(d=g+"/os-keypairs",a={keypair:{name:a}},b!==f&&(a.keypair.public_key=b),c.Comm.post(d,a,c.Keystone.params.token,function(a){e!==f&&e(a)},function(a){throw Error(a);}))},deletekeypair:function(a,b){var e;h()&&(e=g+"/os-keypairs/"+a,c.Comm.del(e,c.Keystone.params.token,function(a){b!==f&&b(a)},function(a){throw Error(a);}))},getkeypairdetail:function(a,b){var e;h()&&(e=g+"/os-keypairs/"+a,c.Comm.get(e,c.Keystone.params.token,
function(a){b!==f&&b(a)},function(a){throw Error(a);}))},getvncconsole:function(a,b,e){if(h()){if(b===f||!b)b="novnc";d(a,{"os-getVNCConsole":{type:b}},null,e)}},getconsoleoutput:function(a,b,e){if(h()){if(b===f||!b)b=35;d(a,{"os-getConsoleOutput":{length:b}},null,e)}},getattachedvolumes:function(a,b){var e;h()&&(e=g+"/servers/"+a+"/os-volume_attachments",c.Comm.get(e,c.Keystone.params.token,function(a){b!==f&&b(a)},function(a){throw Error(a);}))},attachvolume:function(a,b,e,d){h()&&(a=g+"/servers/"+
a+"/os-volume_attachments",b===f||e===f||c.Comm.post(a,{volumeAttachment:{volumeId:b,device:e}},c.Keystone.params.token,function(a){d!==f&&d(a)},function(a){throw Error(a);}))},detachvolume:function(a,b,e){h()&&(a=g+"/servers/"+a+"/os-volume_attachments/"+b,b!==f&&c.Comm.del(a,c.Keystone.params.token,function(a){e!==f&&e(a)},function(a){throw Error(a);}))},getattachedvolume:function(a,b,e){h()&&(a=g+"/servers/"+a+"/os-volume_attachments/"+b,b!==f&&c.Comm.get(a,c.Keystone.params.token,function(a){e!==
f&&e(a)},function(a){throw Error(a);}))},getquotalist:function(a){var b;h()&&(b=g.split("/"),b=g+"/os-quota-sets/"+b[b.length-1],c.Comm.get(b,c.Keystone.params.token,function(b){a!==f&&a(b)},function(a){throw Error(a);}))},updatequota:function(a,b,e,d,k,j,m,l,o,p,r,q,t,u,s){h()&&(a=g+"/os-quota-sets/"+a,b={quota_set:{instances:b,cores:e,ram:d,volumes:k,gigabytes:j,floating_ips:m,metadata_items:l,injected_files:o,injected_file_content_bytes:p,injected_file_path_bytes:r,security_groups:q,security_group_rules:t,
key_pairs:u}},c.Comm.post(a,b,c.Keystone.params.token,function(a){s!==f&&s(a)},function(a){throw Error(a);}))},getdefaultquotalist:function(a,b){var e;h()&&(e=g+"/os-quota-sets/"+a+"/defaults",c.Comm.get(e,c.Keystone.params.token,function(a){b!==f&&b(a)},function(a){throw Error(a);}))},getsecuritygrouplist:function(a){var b;h()&&(b=g+"/os-security-groups",c.Comm.get(b,c.Keystone.params.token,function(b){a!==f&&a(b)},function(a){throw Error(a);}))},createsecuritygroup:function(a,b,e){var d;h()&&(d=
g+"/os-security-groups",a={security_group:{name:a,description:b}},console.log(d),c.Comm.post(d,a,c.Keystone.params.token,function(a){e!==f&&e(a)},function(a){throw Error(a);}))},getsecuritygroupdetail:function(a,b){var e;h()&&(e=g+"/os-security-groups/"+a,console.log(e),c.Comm.get(e,c.Keystone.params.token,function(a){b!==f&&b(a)},function(a){throw Error(a);}))},deletesecuritygroup:function(a,b){var e;h()&&(e=g+"/os-security-group-rules/"+a,console.log(e),c.Comm.del(e,c.Keystone.params.token,function(a){b!==
f&&b(a)},function(a){throw Error(a);}))},createsecuritygrouprule:function(a,b,e,d,j,n,m){var l;h()&&(l=g+"/os-security-group-rules",a={security_group_rule:{ip_protocol:a,from_port:b,to_port:e,cidr:d,group_id:j,parent_group_id:n}},console.log(l),c.Comm.post(l,a,c.Keystone.params.token,function(a){m!==f&&m(a)},function(a){throw Error(a);}))},deletesecuritygrouprule:function(a,b){var e;h()&&(e=g+"/os-security-groups/"+a,console.log(e),c.Comm.del(e,c.Keystone.params.token,function(a){b!==f&&b(a)},function(a){throw Error(a);
}))},getsecuritygroupforserver:function(a,b){var e;h()&&(e=g+"/servers/"+a+"/os-security-groups",console.log(e),c.Comm.get(e,c.Keystone.params.token,function(a){b!==f&&b(a)},function(a){throw Error(a);}))}}}(JSTACK);JSTACK.Nova.Volume=function(c,f){var g,j,h;g=f;j="publicURL";h=function(){return c.Keystone!==f&&c.Keystone.params.currentstate===c.Keystone.STATES.AUTHENTICATED?(g=c.Keystone.getservice("volume").endpoints[0][j],!0):!1};return{configure:function(c){if("adminURL"===c||"internalURL"===c||"publicURL"===c)j=c},getvolumelist:function(d,a){var b;h()&&(b=g+"/volumes",d!==f&&d&&(b+="/detail"),c.Comm.get(b,c.Keystone.params.token,function(b){a!==f&&a(b)},function(a){throw Error(a);}))},createvolume:function(d,
a,b,e){h()&&(d={volume:{size:d}},a!==f&&(d.volume.display_name=a),b!==f&&(d.volume.display_description=b),c.Comm.post(g+"/volumes",d,c.Keystone.params.token,function(a){e!==f&&e(a)},function(a){throw Error(a);}))},deletevolume:function(d,a){var b;h()&&(b=g+"/volumes/"+d,c.Comm.del(b,c.Keystone.params.token,function(b){a!==f&&a(b)},function(a){throw Error(a);}))},getvolume:function(d,a){var b;h()&&(b=g+"/volumes/"+d,c.Comm.get(b,c.Keystone.params.token,function(b){a!==f&&a(b)},function(a){throw Error(a);
}))},getsnapshotlist:function(d,a){var b;h()&&(b=g+"/snapshots",d!==f&&d&&(b+="/detail"),c.Comm.get(b,c.Keystone.params.token,function(b){a!==f&&a(b)},function(a){throw Error(a);}))},createsnapshot:function(d,a,b,e){h()&&(d={snapshot:{volume_id:d,force:!0}},a!==f&&(d.snapshot.display_name=a),b!==f&&(d.snapshot.display_description=b),c.Comm.post(g+"/snapshots",d,c.Keystone.params.token,function(a){e!==f&&e(a)},function(a){throw Error(a);}))},deletesnapshot:function(d,a){var b;h()&&(b=g+"/snapshots/"+
d,c.Comm.del(b,c.Keystone.params.token,function(b){a!==f&&a(b)},function(a){throw Error(a);}))},getsnapshot:function(d,a){var b;h()&&(b=g+"/snapshots/"+d,c.Comm.get(b,c.Keystone.params.token,function(b){a!==f&&a(b)},function(a){throw Error(a);}))}}}(JSTACK);JSTACK.Glance=function(c,f){var g,j,h;g=f;j="publicURL";h=function(){return c.Keystone!==f&&c.Keystone.params.currentstate===c.Keystone.STATES.AUTHENTICATED?(g=c.Keystone.getservice("image").endpoints[0][j],!0):!1};return{configure:function(c){if("adminURL"===c||"internalURL"===c||"publicURL"===c)j=c},getimagelist:function(d,a){var b;h()&&(b=g+"/images",d!==f&&d&&(b+="/detail"),c.Comm.get(b,c.Keystone.params.token,function(b){a!==f&&a(b)},function(a){throw Error(a);}))}}}(JSTACK);
