import{O as k,P as L,Q as N,f as w,t as E,x as M,y as b}from"./chunk-NNB3VKRW.js";import{Na as S,Oa as F,h as a,j as _,k as x,l as C,m,o as T,q as v,r as y,t as h}from"./chunk-EGG6BMW4.js";import{a as D}from"./chunk-LMFI632N.js";import{$ as d,Ia as o,Ma as e,Na as t,Oa as s,Ob as f,Va as c,W as p,cb as i,jb as g,ua as n}from"./chunk-26FXOFCC.js";var W=(()=>{class u{authService=p(D);loginForm=new C({email:new m("",[a.required]),password:new m("",[a.required])});login(){this.authService.login(this.loginForm.controls.email.value,this.loginForm.controls.password.value).subscribe()}static \u0275fac=function(r){return new(r||u)};static \u0275cmp=d({type:u,selectors:[["lib-auth-login"]],standalone:!0,features:[g],decls:17,vars:5,consts:[[1,"login"],[1,"login__form",3,"formGroup"],[1,"login__head"],["src","logo.png","alt","tbank-logo",1,"login__logo"],[1,"login__title"],["type","email","formControlName","email","tuiTextfieldSize","l",3,"tuiTextfieldCleaner"],["type","password","formControlName","password","tuiTextfieldSize","l",3,"tuiTextfieldCleaner"],["appearance","primary","size","m","tuiButton","","type","button",3,"click","disabled"],[1,"login__message"],["tuiLink","",3,"routerLink"]],template:function(r,l){r&1&&(e(0,"div",0)(1,"form",1)(2,"div",2),s(3,"img",3),e(4,"h2",4),i(5," \u0410\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F "),t()(),e(6,"tui-input",5),i(7," \u0412\u0432\u0435\u0434\u0438\u0442\u0435 email "),t(),e(8,"tui-input",6),i(9," \u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C "),t(),e(10,"button",7),c("click",function(){return l.login()}),i(11," \u0412\u043E\u0439\u0442\u0438 "),t()(),e(12,"div",8)(13,"span"),i(14,"\u041D\u0435\u0442 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430?"),t(),e(15,"a",9),i(16,"\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F"),t()()()),r&2&&(n(),o("formGroup",l.loginForm),n(5),o("tuiTextfieldCleaner",!0),n(2),o("tuiTextfieldCleaner",!0),n(2),o("disabled",l.loginForm.invalid),n(5),o("routerLink","/auth/register"))},dependencies:[h,T,_,x,v,y,f,S,N,k,L,F,w,b,E,M],styles:[".login__form[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:30px;width:400px}.login__title[_ngcontent-%COMP%]{font-size:24px;align-self:center}.login__head[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:center;gap:30px;align-items:center}.login__logo[_ngcontent-%COMP%]{width:75px;height:75px}.login__message[_ngcontent-%COMP%]{margin-top:10px;display:flex;justify-content:center;gap:10px}"],changeDetection:0})}return u})();export{W as LoginComponent};
