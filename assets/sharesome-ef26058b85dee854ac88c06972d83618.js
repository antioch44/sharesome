"use strict"
define("sharesome/app",["exports","sharesome/resolver","ember-load-initializers","sharesome/config/environment"],function(e,t,n,o){Object.defineProperty(e,"__esModule",{value:!0})
var r=Ember.Application.extend({modulePrefix:o.default.modulePrefix,podModulePrefix:o.default.podModulePrefix,Resolver:t.default});(0,n.default)(r,o.default.modulePrefix),e.default=r}),define("sharesome/components/file-dropzone",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0})
var t=Ember.Component
e.default=t.extend({tagName:"section",classNames:["file-dropzone content upload"],classNameBindings:["hasFileToUpload"],dragEnter:function(){return this.$().addClass("drag-active"),!1},dragOver:function(){return!1},dragLeave:function(){return this.$().removeClass("drag-active"),!1},drop:function(e){e.preventDefault(),this.$().removeClass("drag-active"),e.stopPropagation&&e.stopPropagation(),e.dataTransfer.files&&e.dataTransfer.files[0]&&this.sendAction("readInputFile",e.dataTransfer.files[0])},actions:{readInputFile:function(e){this.sendAction("readInputFile",e)}}})}),define("sharesome/components/file-input",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0})
var t=Ember.isPresent,n=Ember.Component
e.default=n.extend({tagName:"input",attributeBindings:["type","accept","multiple","disabled"],type:"file",accept:"image/*",multiple:!1,attachment:null,filename:null,disabled:null,maxFileSize:null,change:function(e){var n=e.target
t(n.files)&&this.sendAction("readInputFile",n.files[0])}})}),define("sharesome/components/history-item",["exports","sharesome/helpers/show-url-dialog"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0})
var n=Ember.String.htmlSafe,o=Ember.Component,r=Ember.computed.alias,s=Ember.inject.service
e.default=o.extend({tagName:"li",remotestorage:s(),overlayIsVisible:!1,url:r("item.url"),name:r("item.name"),isImage:function(){return this.get("url").match(/(jpg|jpeg|png|gif|webp)$/i)}.property("url"),thumbnailUrl:function(){return this.get("remotestorage.shares").getThumbnailURL(this.get("name"))}.property("name"),itemStyle:function(){if(this.get("isImage"))return n("background-image:url("+this.get("thumbnailUrl")+");background-color:#ccc")}.property("url"),nameWithoutTimestamp:function(){return this.get("name").substr(12)}.property("name"),isSmallScreen:function(){return window.innerWidth<=640}.property(),click:function(){this.get("isSmallScreen")&&this.toggleProperty("overlayIsVisible")},actions:{share:function(){(0,t.showUrlDialog)(this.get("url"))},zoom:function(){var e=void 0
e=this.get("isImage")?"<img src='"+this.get("url")+"' class='zoomed'>":"No preview available.",window.vex.dialog.alert(e)},remove:function(){var e=this
this.set("item.isDeleting",!0),this.get("remotestorage.shares").remove(this.get("name")).then(function(){e.sendAction("removeItem",e.get("item"))},function(t){e.set("item.isDeleting",!1),window.alert("Couldn't remove item. Please try again. Sorry!"),console.log(t)})}}})}),define("sharesome/components/loading-spinner",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0})
var t=Ember.Component
e.default=t.extend({startSpinner:function(){var e=this.$(".spinner-wrapper")
e.css("height",this.get("height")+"px")
var t={lines:this.get("lines")||13,length:this.get("length")||20,width:this.get("width")||10,radius:this.get("radius")||30,corners:this.get("corners")||1,rotate:this.get("rotate")||0,direction:this.get("direction")||1,color:this.get("color")||"#000",speed:this.get("speed")||1,trail:this.get("trail")||60,shadow:this.get("shadow")||!1,hwaccel:this.get("hwaccel")||!0,className:"spinner",zIndex:this.get("zIndex")||2e9,top:this.get("top")||"0",left:this.get("left")||"0"}
e.spin(t)}.on("didInsertElement")})}),define("sharesome/controllers/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0})
var t=Ember.Controller,n=Ember.computed.alias,o=Ember.inject.service
e.default=t.extend({remotestorage:o(),rs:n("remotestorage.rs")})}),define("sharesome/controllers/history",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0})
var t=Ember.Controller,n=Ember.computed.sort
e.default=t.extend({queryInput:"",sortProperties:["name:desc"],sortedModel:n("filteredModel","sortProperties"),queryChanged:function(){var e=this.get("model"),t=this.get("queryInput")
""!==t&&(e=e.filter(function(e){return e.name.toLowerCase().includes(t)})),this.set("filteredModel",e)}.observes("queryInput","model"),itemCount:function(){return this.get("model").length}.property("model.[]"),actions:{removeItem:function(e){this.get("model").removeObject(e)}}})}),define("sharesome/controllers/upload",["exports","sharesome/helpers/show-url-dialog"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0})
var n=Ember.Object,o=Ember.Controller,r=Ember.computed.alias,s=Ember.inject.service
e.default=o.extend({remotestorage:s(),rs:r("remotestorage.rs"),file:null,isUploading:!1,hasFileToUpload:function(){return null!==this.get("file")}.property("file"),fileIsImage:function(){return this.get("file.type").match("image.*")}.property("file"),simpleFileType:function(){var e=this.get("file.type")
return e&&void 0!==e&&""!==e?e.replace("/","-"):"unkown"}.property("file"),isSmallScreen:function(){return window.innerWidth<=640}.property(),actions:{readInputFile:function(e){var t=this,o=n.create({name:e.name,type:e.type,size:e.size,binary:null,base64:null})
if(this.set("file",o),e.type.match("image.*")){var r=new FileReader
r.onload=function(){t.get("file").set("base64",this.result)},r.readAsDataURL(e)}var s=new FileReader
s.onload=function(){t.get("file").set("binary",this.result)},s.readAsArrayBuffer(e)},cancelFileUpload:function(){this.set("file",null)},submitFileUpload:function(){var e=this,n=this.get("file")
this.set("isUploading",!0),this.get("rs").shares.storeFile(n.get("type"),n.get("name"),n.get("binary")).then(function(n){e.setProperties({file:null,isUploading:!1}),(0,t.showUrlDialog)(n)},function(t){e.set("isUploading",!1),window.vex.dialog.alert("Something bad happened during upload.<br />Please try again."),Ember.Logger.error(t)})}}})}),define("sharesome/helpers/app-version",["exports","sharesome/config/environment","ember-cli-app-version/utils/regexp"],function(e,t,n){function o(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}
return t.hideSha?r.match(n.versionRegExp)[0]:t.hideVersion?r.match(n.shaRegExp)[0]:r}Object.defineProperty(e,"__esModule",{value:!0}),e.appVersion=o
var r=t.default.APP.version
e.default=Ember.Helper.helper(o)}),define("sharesome/helpers/copy-to-clipboard",["exports"],function(e){function t(e){var t=o("<div>")
t.css({position:"absolute",left:"-1000px",top:"-1000px"}),t.text(e),o("body").append(t)
var n=document.createRange(),r=window.getSelection()
r.removeAllRanges(),n.selectNodeContents(t.get(0)),r.addRange(n)
var s=document.execCommand("copy")
return r.removeAllRanges(),t.remove(),s}Object.defineProperty(e,"__esModule",{value:!0}),e.copyToClipboard=t
var n=Ember.Helper.helper,o=Ember.$
e.default=n(t)}),define("sharesome/helpers/human-file-size",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0})
var t=Ember.Helper.helper
e.default=t(function(e){var t=-1,n=[" KB"," MB"," GB"," TB","PB","EB","ZB","YB"]
do{e/=1024,t++}while(e>1024)
return String(Math.max(e,.1).toFixed(1)+n[t])})}),define("sharesome/helpers/moment-calendar",["exports","sharesome/config/environment","ember-moment/helpers/moment-calendar"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=n.default.extend({globalAllowEmpty:!!Ember.get(t.default,"moment.allowEmpty")})}),define("sharesome/helpers/moment-duration",["exports","ember-moment/helpers/moment-duration"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("sharesome/helpers/moment-format",["exports","sharesome/config/environment","ember-moment/helpers/moment-format"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=n.default.extend({globalAllowEmpty:!!Ember.get(t.default,"moment.allowEmpty")})}),define("sharesome/helpers/moment-from-now",["exports","sharesome/config/environment","ember-moment/helpers/moment-from-now"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=n.default.extend({globalAllowEmpty:!!Ember.get(t.default,"moment.allowEmpty")})}),define("sharesome/helpers/moment-to-now",["exports","sharesome/config/environment","ember-moment/helpers/moment-to-now"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=n.default.extend({globalAllowEmpty:!!Ember.get(t.default,"moment.allowEmpty")})}),define("sharesome/helpers/now",["exports","ember-moment/helpers/now"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("sharesome/helpers/show-url-dialog",["exports","sharesome/helpers/copy-to-clipboard"],function(e,t){function n(e){window.vex.dialog.alert('Direct URL:\n     <p><input type="text" value="'+e+'"></p>\n     <p class="actions"><button class="icon copy-url" title="copy to clipboard"><img src="/assets/images/copy.svg" alt="copy"></button></p>'),r(".vex-content input").first().select(),r(".vex-content button.copy-url").on("click",function(e){e.preventDefault(),(0,t.copyToClipboard)(r(".vex-content input").val()),r(".vex-content button.copy-url img").attr("src","/assets/images/checkmark.svg"),setTimeout(function(){window.vex.closeAll()},1e3)})}Object.defineProperty(e,"__esModule",{value:!0}),e.showUrlDialog=n
var o=Ember.Helper.helper,r=Ember.$
e.default=o(n)}),define("sharesome/initializers/app-version",["exports","ember-cli-app-version/initializer-factory","sharesome/config/environment"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0})
var o=n.default.APP,r=o.name,s=o.version
e.default={name:"App Version",initialize:(0,t.default)(r,s)}}),define("sharesome/initializers/container-debug-adapter",["exports","ember-resolver/resolvers/classic/container-debug-adapter"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"container-debug-adapter",initialize:function(){var e=arguments[1]||arguments[0]
e.register("container-debug-adapter:main",t.default),e.inject("container-debug-adapter:main","namespace","application:main")}}}),define("sharesome/initializers/export-application-global",["exports","sharesome/config/environment"],function(e,t){function n(){var e=arguments[1]||arguments[0]
if(!1!==t.default.exportApplicationGlobal){var n
if("undefined"!=typeof window)n=window
else if("undefined"!=typeof global)n=global
else{if("undefined"==typeof self)return
n=self}var o,r=t.default.exportApplicationGlobal
o="string"==typeof r?r:Ember.String.classify(t.default.modulePrefix),n[o]||(n[o]=e,e.reopen({willDestroy:function(){this._super.apply(this,arguments),delete n[o]}}))}}Object.defineProperty(e,"__esModule",{value:!0}),e.initialize=n,e.default={name:"export-application-global",initialize:n}}),define("sharesome/initializers/vex",["exports"],function(e){function t(){window.vex.defaultOptions.className="vex-theme-flat-attack"}Object.defineProperty(e,"__esModule",{value:!0}),e.initialize=t,e.default={name:"vex",initialize:t}}),define("sharesome/instance-initializers/body-class",["exports","ember-body-class/instance-initializers/body-class"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"initialize",{enumerable:!0,get:function(){return t.initialize}})}),define("sharesome/resolver",["exports","ember-resolver"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default}),define("sharesome/router",["exports","sharesome/config/environment"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0})
var n=Ember.Router.extend({location:t.default.locationType,rootURL:t.default.rootURL})
n.map(function(){this.route("history",{path:"/history"}),this.route("connect")}),e.default=n}),define("sharesome/routes/application",["exports","ember-body-class/mixins/body-class"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0})
var n=Ember.Route,o=Ember.inject.service
e.default=n.extend(t.default,{storage:o("remotestorage"),beforeModel:function(){var e=this
this.get("storage.rs").on("error",function(t){console.debug("rs.on error",t),"Unauthorized"===t.name?e.handleUnauthorized():"DiscoveryError"===t.name||alert("An unknown error occured. Please check the browser console for details.")})},handleUnauthorized:function(){this.get("storage.unauthorized")||(this.get("storage").setProperties({unauthorized:!0,connecting:!1,connected:!1}),this.transitionTo("connect"))}})}),define("sharesome/routes/connect",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0})
var t=Ember.Route,n=Ember.inject.service,o=Ember.run.later,r=Ember.RSVP.Promise
e.default=t.extend({storage:n("remotestorage"),beforeModel:function(){var e=this
return this.waitForConnectionState().then(function(){e.get("storage.connected")&&e.transitionTo("index")})},waitForConnectionState:function(){var e=this
return new r(function(t){function n(){e.get("storage.connecting")?o(n,20):t()}n()})}})}),define("sharesome/routes/history",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0})
var t=Ember.Object,n=Ember.Route,o=Ember.computed.alias,r=Ember.inject.service
e.default=n.extend({remotestorage:r(),rs:o("remotestorage.rs"),rsConnected:o("remotestorage.connected"),beforeModel:function(){this.get("rsConnected")||this.transitionTo("index")},model:function(){var e=this
return this.get("rs").shares.list().then(function(n){var o=[]
return Object.keys(n).forEach(function(n){var r=t.create({name:n,url:e.get("rs").shares.getFileURL(n),isDeleting:!1})
o.pushObject(r)}),o})}})}),define("sharesome/routes/index",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0})
var t=Ember.Route,n=Ember.inject.service,o=Ember.run.later,r=Ember.RSVP.Promise
e.default=t.extend({storage:n("remotestorage"),beforeModel:function(){var e=this
return this.waitForConnectionState().then(function(){e.get("storage.disconnected")&&e.transitionTo("connect")})},renderTemplate:function(){this.render("upload",{controller:"upload"})},waitForConnectionState:function(){var e=this
return new r(function(t){function n(){e.get("storage.connecting")?o(n,20):t()}n()})},init:function(){var e=this
this._super.apply(this,arguments),this.get("storage.rs").on("disconnected",function(){e.transitionTo("connect")})}})}),define("sharesome/services/ajax",["exports","ember-ajax/services/ajax"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})})
define("sharesome/services/moment",["exports","sharesome/config/environment","ember-moment/services/moment"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=n.default.extend({defaultFormat:Ember.get(t.default,"moment.outputFormat")})}),define("sharesome/services/remotestorage",["exports","npm:remotestoragejs","npm:remotestorage-widget","npm:remotestorage-module-shares"],function(e,t,n,o){Object.defineProperty(e,"__esModule",{value:!0})
var r=Ember.Service,s=Ember.computed,a=Ember.run.scheduleOnce
e.default=r.extend({rs:null,shares:null,widget:null,connected:!1,connecting:!0,unauthorized:!1,disconnected:s.not("connected"),setup:function(){var e=this,r=new t.default({cache:!1,requestTimeout:9e4,modules:[o.default.default]})
r.access.claim("shares","rw"),r.on("ready",function(){console.debug("RS ready")}),r.on("not-connected",function(){console.debug("RS not-connected"),e.setProperties({connecting:!1,connected:!1})}),r.on("connected",function(){console.debug("RS connected"),e.setProperties({connecting:!1,connected:!0})}),r.on("disconnected",function(){console.debug("RS disconnected"),e.setProperties({connecting:!1,connected:!1})}),r.on("connecting",function(){console.debug("RS connecting"),e.setProperties({connecting:!0,connected:!1})}),r.on("authing",function(){console.debug("RS authing"),e.setProperties({connecting:!0,connected:!1})}),this.set("rs",r),this.set("shares",r.shares)
var s=new n.default(r,{})
a("afterRender",function(){s.attach("rs-widget-container")}),this.set("widget",s)}.on("init")})}),define("sharesome/templates/_welcome",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"4cNeRP/G",block:'{"symbols":[],"statements":[[6,"h2"],[7],[0,"Welcome!"],[8],[0,"\\n"],[6,"p"],[7],[0,"\\n  With "],[6,"em"],[7],[0,"Sharesome"],[8],[0,", you can share files on the Web from your own\\n  remote storage.\\n"],[8],[0,"\\n"],[6,"p"],[7],[0,"\\n  Connect your storage below, or "],[6,"a"],[9,"target","_blank"],[9,"href","http://remotestorage.io/get"],[7],[0,"visit the remoteStorage website"],[8],[0," to\\n  register for an account or learn how to set up your own storage server.\\n"],[8],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"sharesome/templates/_welcome.hbs"}})}),define("sharesome/templates/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"dY0Md/JO",block:'{"symbols":[],"statements":[[6,"nav"],[7],[0,"\\n  "],[6,"ul"],[7],[0,"\\n    "],[6,"li"],[9,"id","logo"],[7],[4,"link-to",["index"],null,{"statements":[[0,"S"]],"parameters":[]},null],[8],[0,"\\n    "],[6,"li"],[9,"id","history"],[7],[4,"link-to",["history"],null,{"statements":[[6,"i"],[9,"class","icon-history"],[7],[8]],"parameters":[]},null],[8],[0,"\\n  "],[8],[0,"\\n"],[8],[0,"\\n"],[6,"main"],[7],[0,"\\n  "],[1,[18,"outlet"],false],[0,"\\n"],[8],[0,"\\n"],[6,"div"],[9,"id","rs-widget-container"],[7],[8],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"sharesome/templates/application.hbs"}})}),define("sharesome/templates/components/file-dropzone",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"bpPZnU98",block:'{"symbols":[],"statements":[[6,"div"],[9,"class","hint"],[7],[0,"\\n  "],[6,"p"],[7],[0,"\\n    "],[6,"span"],[9,"class","draghere"],[7],[0,"Drag file here or tap anywhere"],[8],[0,"\\n    "],[6,"span"],[9,"class","taptoupload"],[7],[0,"Tap anywhere and select a file"],[8],[0,"\\n  "],[8],[0,"\\n"],[8],[0,"\\n"],[6,"label"],[9,"class","file-picker"],[7],[0,"\\n  "],[1,[25,"file-input",null,[["readInputFile"],["readInputFile"]]],false],[0,"\\n"],[8],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"sharesome/templates/components/file-dropzone.hbs"}})}),define("sharesome/templates/components/history-item",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"b9gAi9sc",block:'{"symbols":[],"statements":[[4,"if",[[19,0,["isImage"]]],null,{"statements":[[0,"  "],[6,"div"],[9,"class","image"],[10,"style",[18,"itemStyle"],null],[7],[8],[0,"\\n"]],"parameters":[]},{"statements":[[0,"  "],[6,"div"],[9,"class","image generic-file"],[7],[0,"\\n    "],[6,"p"],[9,"class","meta"],[7],[1,[18,"nameWithoutTimestamp"],false],[8],[0,"\\n  "],[8],[0,"\\n"]],"parameters":[]}],[0,"\\n"],[6,"div"],[10,"class",[26,["overlay ",[25,"if",[[19,0,["overlayIsVisible"]],"visible"],null]]]],[7],[0,"\\n  "],[6,"a"],[9,"class","share"],[3,"action",[[19,0,[]],"share"]],[7],[6,"i"],[9,"class","icon-export"],[7],[8],[8],[0,"\\n  "],[6,"a"],[9,"class","zoom"],[3,"action",[[19,0,[]],"zoom"]],[7],[6,"i"],[9,"class","icon-eye"],[7],[8],[8],[0,"\\n  "],[6,"a"],[9,"class","go-to-url"],[10,"href",[18,"url"],null],[9,"target","_blank"],[7],[6,"i"],[9,"class","icon-download"],[7],[8],[8],[0,"\\n  "],[6,"a"],[9,"class","delete"],[3,"action",[[19,0,[]],"remove"]],[7],[6,"i"],[9,"class","icon-trash"],[7],[8],[8],[0,"\\n"],[8],[0,"\\n\\n"],[4,"if",[[19,0,["item","isDeleting"]]],null,{"statements":[[0,"  "],[6,"div"],[9,"class","overlay-deleting"],[7],[0,"\\n"],[4,"if",[[19,0,["isSmallScreen"]]],null,{"statements":[[0,"    "],[1,[25,"loading-spinner",null,[["height","width","radius","color","top","left"],[120,3,20,"#eee","auto","auto"]]],false],[0,"\\n"]],"parameters":[]},{"statements":[[0,"    "],[1,[25,"loading-spinner",null,[["height","width","radius","color","top","left"],[200,4,20,"#eee","auto","auto"]]],false],[0,"\\n"]],"parameters":[]}],[0,"  "],[8],[0,"\\n"]],"parameters":[]},null]],"hasEval":false}',meta:{moduleName:"sharesome/templates/components/history-item.hbs"}})}),define("sharesome/templates/components/loading-spinner",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"CFjmvOLJ",block:'{"symbols":[],"statements":[[6,"div"],[9,"class","spinner-wrapper"],[7],[8],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"sharesome/templates/components/loading-spinner.hbs"}})}),define("sharesome/templates/connect",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"Cvt7Ja2k",block:'{"symbols":[],"statements":[[6,"section"],[9,"class","content welcome"],[7],[0,"\\n  "],[12,"welcome",[]],[0,"\\n"],[8]],"hasEval":true}',meta:{moduleName:"sharesome/templates/connect.hbs"}})}),define("sharesome/templates/history",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"LGZk44lK",block:'{"symbols":["item"],"statements":[[6,"section"],[9,"class","content history"],[7],[0,"\\n  "],[6,"div"],[9,"class","search"],[7],[0,"\\n    "],[1,[25,"input",null,[["value","placeholder","class"],[[19,0,["queryInput"]],"Search","search-field"]]],false],[0,"\\n  "],[8],[0,"\\n"],[4,"if",[[19,0,["sortedModel"]]],null,{"statements":[[0,"  "],[6,"ul"],[7],[0,"\\n"],[4,"each",[[19,0,["sortedModel"]]],null,{"statements":[[0,"      "],[1,[25,"history-item",null,[["item","removeItem"],[[19,1,[]],"removeItem"]]],false],[0,"\\n"]],"parameters":[1]},null],[0,"  "],[8],[0,"\\n"]],"parameters":[]},{"statements":[[0,"  "],[6,"div"],[9,"class","no-items"],[7],[0,"\\n    "],[6,"p"],[7],[0,"\\n      You haven\'t shared any files yet.\\n    "],[8],[0,"\\n  "],[8],[0,"\\n"]],"parameters":[]}],[8],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"sharesome/templates/history.hbs"}})}),define("sharesome/templates/loading",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"zRe2rcX8",block:'{"symbols":[],"statements":[[6,"section"],[9,"id","loading"],[7],[0,"\\n  "],[6,"div"],[9,"class","loading-spinner"],[7],[0,"\\n    "],[6,"div"],[9,"class","bounce1"],[7],[8],[0,"\\n    "],[6,"div"],[9,"class","bounce2"],[7],[8],[0,"\\n    "],[6,"div"],[9,"class","bounce3"],[7],[8],[0,"\\n  "],[8],[0,"\\n"],[8],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"sharesome/templates/loading.hbs"}})}),define("sharesome/templates/upload",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"UViRxcY3",block:'{"symbols":[],"statements":[[1,[25,"file-dropzone",null,[["hasFileToUpload","readInputFile"],[[19,0,["hasFileToUpload"]],"readInputFile"]]],false],[0,"\\n\\n"],[4,"if",[[19,0,["hasFileToUpload"]]],null,{"statements":[[4,"if",[[19,0,["isUploading"]]],null,{"statements":[[0,"    "],[6,"section"],[9,"class","content upload-in-progress"],[7],[0,"\\n"],[4,"if",[[19,0,["isSmallScreen"]]],null,{"statements":[[0,"      "],[1,[25,"loading-spinner",null,[["height","width","radius","color","top","left"],[200,4,20,"#222","auto","auto"]]],false],[0,"\\n"]],"parameters":[]},{"statements":[[0,"      "],[1,[25,"loading-spinner",null,[["height","width","radius","color","top","left"],[300,5,30,"#222","auto","auto"]]],false],[0,"\\n"]],"parameters":[]}],[0,"      "],[6,"p"],[7],[0,"Uploading"],[8],[0,"\\n    "],[8],[0,"\\n"]],"parameters":[]},{"statements":[[0,"    "],[6,"section"],[9,"class","content upload-preview"],[7],[0,"\\n      "],[6,"div"],[9,"class","upload-preview"],[7],[0,"\\n"],[4,"if",[[19,0,["fileIsImage"]]],null,{"statements":[[0,"        "],[6,"div"],[9,"id","file-preview"],[9,"class","image"],[7],[0,"\\n          "],[6,"img"],[9,"id","preview-image"],[10,"src",[20,["file","base64"]],null],[7],[8],[0,"\\n        "],[8],[0,"\\n"]],"parameters":[]},{"statements":[[0,"        "],[6,"div"],[9,"id","file-preview"],[10,"class",[18,"simpleFileType"],null],[7],[0,"\\n          "],[6,"p"],[7],[0,"icon for CSS class"],[6,"br"],[7],[8],[6,"code"],[7],[0,"#filepreview."],[1,[18,"simpleFileType"],false],[8],[8],[0,"\\n        "],[8],[0,"\\n"]],"parameters":[]}],[0,"        "],[6,"p"],[9,"class","meta-data"],[7],[0,"\\n          "],[6,"span"],[9,"class","name"],[7],[1,[20,["file","name"]],false],[8],[0,"\\n          "],[6,"span"],[9,"class","size"],[7],[1,[25,"human-file-size",[[19,0,["file","size"]]],null],false],[8],[0,"\\n        "],[8],[0,"\\n        "],[6,"p"],[9,"class","actions"],[7],[0,"\\n          "],[6,"button"],[9,"class","upload"],[3,"action",[[19,0,[]],"submitFileUpload"]],[7],[0,"Upload"],[8],[0,"\\n          "],[6,"button"],[9,"class","cancel"],[3,"action",[[19,0,[]],"cancelFileUpload"]],[7],[0,"Cancel"],[8],[0,"\\n        "],[8],[0,"\\n      "],[8],[0,"\\n    "],[8],[0,"\\n"]],"parameters":[]}]],"parameters":[]},null]],"hasEval":false}',meta:{moduleName:"sharesome/templates/upload.hbs"}})}),define("sharesome/config/environment",[],function(){try{var e="sharesome/config/environment",t=document.querySelector('meta[name="'+e+'"]').getAttribute("content"),n={default:JSON.parse(unescape(t))}
return Object.defineProperty(n,"__esModule",{value:!0}),n}catch(t){throw new Error('Could not read config from meta tag with name "'+e+'".')}}),runningTests||require("sharesome/app").default.create({name:"sharesome",version:"1.1.3+edb9f6dc"})
