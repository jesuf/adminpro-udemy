import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';


import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', component: NopagefoundComponent },
];

// Misma forma de hacerlo que con NgModule pero en una sola linea y sin necesidad de importar NgModule
// En cualquier caso estamos exportando un modulo que deberemos importar en otro modulo,
// pero en vez de llamar al archivo app-routing.module.ts,
// queda mas claro a la vista diferenciarlo llamándolo app-routing.routes.ts

//export const AppRoutingModule: RouterModule = RouterModule.forRoot(routes, {useHash: true});

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {}
