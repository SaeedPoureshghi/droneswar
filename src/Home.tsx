import WebApp from "@twa-dev/sdk"
import App from "./App"
import { useEffect, useState } from "react";
import Logo from "./assets/dron640x360.png"

const Home = () => {

    const [isEnable, setIsEnable] = useState(false);
    const [g, setG] = useState<{x:number, y:number, z: number}>({x:0,y:0,z:0});
    
    useEffect(() => {
    
    WebApp.ready()

    
    
   const gr = WebApp.DeviceOrientation.start({refresh_rate:1000, need_absolute: true});   
    
   WebApp.onEvent("deviceOrientationFailed",() => setIsEnable(true)) 
   
   WebApp.onEvent("deviceOrientationChanged", () => {
    
    if (!isEnable) {

        setG({
            x: Math.floor(gr.alpha * 10),
            y: Math.floor(gr.beta * 10),
            z:gr.gamma * 10
        })
        setIsEnable(true);
    }
    
    if (isEnable) {

        setIsEnable(true);
        
        // add delta of current position to previous position
        setG((prev) => {
            return {
                x: prev.x + gr.alpha,
                y: prev.y + gr.beta,
                z: prev.z + gr.gamma 
    }})
}
   })   
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
    





    if (isEnable) {
        return (
         
              <App y={g?.y ?? 0} z={g?.z ?? 0} x={g?.x ?? 0} />
         
        )
    }

    return (
        <div style={{display:"flex",flexDirection:"column", minHeight:"100vh", justifyContent:"center", alignItems:"center"}}>
        <img src={Logo} alt="logo" style={{width:"320px", height:"auto"}}
        
        />
        <h2>Loading...</h2>
        </div>
    )
}

export default Home
