document.addEventListener("DOMContentLoaded",()=>{ 

    //window.addEventListener('load', async e =>{
    
        if("serviceWorker" in navigator){
            try{
                navigator.serviceWorker.register('sw.js');
                console.log('service worker registered');
            }
            catch (error){
                console.log("SW registration failed");
            }
        }
    //})

    // document.getElementById("btndownload").style.visibility = "hidden";
    
    document.getElementById("btnUpload").addEventListener("click",
    function subform(){

   
        document.forms["frmUpload"].submit();
        //callback();
    });

function updateDownload(){

    document.getElementById("btndownload").style.visibility = "visible";

} 

if(document.getElementById("rslt").innerHTML.length==0){
    document.getElementById("btndownload").style.display = 'none'
}
else{
    document.getElementById("btndownload").style.display = 'inline-block'
    document.getElementById("tips").style.display = 'none'
}

});
