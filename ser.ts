import { svc } from "./services";


svc.on('install',() =>{
    svc.start();
})

svc.install();