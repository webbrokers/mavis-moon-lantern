// Call directly from a click so the browser retains the user gesture.
// Unsupported or rejected fullscreen must never prevent starting the game.
export async function enterFullscreen(doc=document){
 if(doc.fullscreenElement||doc.webkitFullscreenElement)return true;
 const root=doc.documentElement;
 const request=root.requestFullscreen||root.webkitRequestFullscreen;
 if(!request)return false;
 try{await request.call(root);return true;}catch{return false;}
}
