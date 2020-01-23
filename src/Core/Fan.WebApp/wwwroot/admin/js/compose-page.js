let app=new Vue({el:"#app",store,mixins:[composeMixin,editorMdMixin],data:()=>({pubClicked:!1,pubText:"",saveVisible:!1,saveDisabled:!1,saveText:"Save",closing:!0,fieldChanged:!1,drawer:null,panel:[!0,!0,!0],menuDate:!1,mediaDialogVisible:!1,previewUrl:null,postUrl:null,previewDialogVisible:!1,editor:null,snackbar:{show:!1,text:"",color:"",mode:"",timeout:1e4},composerUploadProgress:!1}),computed:{disablePubButton(){return 0>=this.page.title.trim().length||this.pubClicked},tok:function(){return document.querySelector("input[name=\"__RequestVerificationToken\"][type=\"hidden\"]").value},headers(){return{headers:{"XSRF-TOKEN":this.tok}}},payload:function(){return{id:this.page.id,parentId:this.page.parentId,postDate:this.page.postDate,title:this.page.title,excerpt:this.page.excerpt,pageLayout:this.page.pageLayout}},selectedImages(){return this.$store.state.selectedImages}},mounted(){this.pubText=this.page.published?"Update":"Publish",this.initWindowDnd(),this.initEditor()},methods:{initWindowDnd(){window.addEventListener("dragenter",function(){document.querySelector("#dropzone").style.visibility="",document.querySelector("#dropzone").style.opacity=1}),window.addEventListener("dragleave",function(a){a.preventDefault(),document.querySelector("#dropzone").style.visibility="hidden",document.querySelector("#dropzone").style.opacity=0}),window.addEventListener("dragover",function(a){a.preventDefault(),document.querySelector("#dropzone").style.visibility="",document.querySelector("#dropzone").style.opacity=1});let a=this;window.addEventListener("drop",function(b){b.preventDefault(),document.querySelector("#dropzone").style.visibility="hidden",document.querySelector("#dropzone").style.opacity=0,a.mediaDialogVisible||a.dragFilesUpload(b.dataTransfer.files)})},dragFilesUpload(a){if(!a.length)return;this.composerUploadProgress=!0;const b=new FormData;Array.from(Array(a.length).keys()).map(c=>b.append("images",a[c])),this.sendImages(b)},sendImages(a){axios.post("/admin/media?handler=image",a,{headers:{"XSRF-TOKEN":this.tok}}).then(a=>{0<a.data.images.length?(this.insertImagesToEditor(a.data.images),this.toast("Image uploaded.")):this.toastError("Some files were not uploaded due to file type or size not supported."),this.composerUploadProgress=!1,this.$store.dispatch("emptyErrMsg")}).catch(()=>{this.composerUploadProgress=!1,this.toastError("Image upload failed.")})},onFieldsChange(){this.fieldChanged=!0;this.page.published||(this.saveVisible=!0,this.saveDisabled=!1,this.saveText="Save")},saveDraft(){this.saveVisible=!0,this.saveDisabled=!0,this.saveText="Saving...",this.payload.body=this.editor.getPreviewedHTML(),this.payload.bodyMark=this.editor.getMarkdown(),axios.post("/admin/compose/page?handler=save",this.payload,{headers:{"XSRF-TOKEN":this.tok}}).then(a=>{this.page.id=a.data.id,this.page.draftDate=a.data.draftDate,this.page.isDraft=!0;let b=window.location.href;if(b.includes("/page?")||b.endsWith("/page")){let a=b.indexOf("?");-1==a?history.replaceState({},null,b+`/${this.page.id}`):history.replaceState({},null,b.substring(0,a)+`/${this.page.id}`+b.substring(a))}}).catch(a=>{this.saveVisible=!1,this.toastError(a.response.data)}),this.fieldChanged=!1,this.saveText="Saved"},preview(){this.previewDialogVisible=!0,this.payload.body=this.editor.getPreviewedHTML(),this.payload.bodyMark=this.editor.getMarkdown(),axios.post("/admin/compose/page?handler=preview",this.payload,{headers:{"XSRF-TOKEN":this.tok}}).then(a=>{this.previewUrl=a.data,this.postUrl=this.previewUrl.replace("preview/page/","")}).catch(()=>{})},closePreview(){this.previewDialogVisible=!1,this.previewUrl=null,this.postUrl=null},revert(){this.page.published=!1,this.pubText=this.page.published?"Update":"Publish",this.saveDraft()},pub(){this.closing=!1,this.pubClicked=!0,this.pubText=this.page.published?"Updating...":"Publishing...";const a=this.page.published?"/admin/compose/page?handler=update":"/admin/compose/page?handler=publish";this.payload.body=this.editor.getPreviewedHTML(),this.payload.bodyMark=this.editor.getMarkdown(),axios.post(a,this.payload,{headers:{"XSRF-TOKEN":this.tok}}).then(a=>{this.page.isParentDraft?this.close():window.location.replace(a.data)}).catch(a=>{this.saveVisible=!1,this.pubText=this.page.published?"Update":"Publish",this.pubClicked=!1,this.toastError(a.response.data)})},close(){this.page.parentId&&0<this.page.parentId?window.location.replace(`/admin/pages/${this.page.parentId}`):window.location.replace("/admin/pages")},insertImages(){this.insertImagesToEditor(this.selectedImages),this.mediaDialogVisible=!1,this.$store.dispatch("emptySelectedImages"),this.$store.dispatch("emptyErrMsg")},insertImagesToEditor(a){let b="";a.forEach(a=>{b+=`![${a.alt}](${a.urlOriginal} "${a.title}")\n`,a.selected=!1}),this.editor.insertValue(b)},closeMediaDialog(){this.mediaDialogVisible=!1,this.selectedImages.forEach(a=>a.selected=!1),this.$store.dispatch("emptySelectedImages"),this.$store.dispatch("emptyErrMsg")},titleEnter(){this.page.title=this.page.title.replace(/\n/g," ")},toast(a,b="silver"){this.snackbar.show=!0,this.snackbar.text=a,this.snackbar.color=b,this.snackbar.mode="",this.snackbar.timeout=3e3},toastError(a){this.snackbar.show=!0,this.snackbar.text=a,this.snackbar.color="red",this.snackbar.timeout=1e4,this.snackbar.mode="multi-line"}}});
//# sourceMappingURL=compose-page.js.map