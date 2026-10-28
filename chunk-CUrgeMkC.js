import{Et as nc,K as CE,Mt as tI,Ot as pI,Tt as mp,Z as Go,at as NE,dt as TI,gt as _y,mt as Wf,nt as Ka,s as Fs,xt as eE,yt as bE}from"./main-GNGQ2IH4.js";import{t as w}from"./chunk-B1XGx-5t.js";var v=()=>({padding:`2rem`,borderRadius:`1.5rem`,backgroundColor:`#333`,color:`green`,borderColor:`green`});var f=(d,l)=>l.name;function b(d,l){if(d&1&&(Go(0,`nc-card`,6)(1,`h3`,8),pI(2),Ka(),Go(3,`p`,9),pI(4),Ka()()),d&2){let i=l.$implicit;Wf(`variant`,i),_y(2),nc(`Card `,i),_y(2),nc(`Some content inside the `,i,` card.`)}}function E(d,l){if(d&1&&(Go(0,`tr`)(1,`td`)(2,`app-code`),pI(3),Ka()(),Go(4,`td`)(5,`app-code`),pI(6),Ka()(),Go(7,`td`)(8,`app-code`),pI(9),Ka()(),Go(10,`td`),pI(11),Ka()()),d&2){let i=l.$implicit;_y(3),mp(i.name),_y(3),mp(i.values),_y(3),mp(i.default),_y(2),mp(i.note)}}var S=class d{variants=[`light`,`medium`,`dark`];inputs=[{name:`variant`,values:`'light' | 'medium' | 'dark'`,default:`'light'`,note:`Background shade of the card.`}];importCode=`// my-page.ts
import { Component } from '@angular/core';
import { Card } from '../../ncss';

@Component({
  selector: 'app-my-page',
  imports: [Card],
  templateUrl: './my-page.html'
})
export class MyPage {}`;usageCode=`<nc-card>Light (default)</nc-card>
<nc-card variant="medium">Medium</nc-card>
<nc-card variant="dark">Dark</nc-card>`;bindingCode=`<!-- Bind the variant to your own state -->
<nc-card [variant]="selected ? 'dark' : 'light'">
  <h3>Title</h3>
  <p>Any content</p>
</nc-card>`;classStyleCode=`<!-- Your classes are added to the card's own classes -->
<nc-card class="my-card">Custom class</nc-card>

<!-- [style] takes an object and overrides everything else -->
<nc-card [style]="{ padding: '2rem', backgroundColor: '#333', color: 'green' }">Custom style</nc-card>`;variablesCode=`/* Override the variables globally, e.g. in styles.css */
:root {
    --card-padding: 1.5rem;
    --card-light-bg: var(--red-50);
    --card-border: 0;
}

/* ...or only inside one part of the page */
.sidebar {
    --card-medium-bg: var(--gray-200);
}`;variablesList=`--card-{light|medium|dark}-bg
--card-border
--card-padding`;classesCode=`<!-- Without the component, use the CSS classes directly -->
<div class="card card-medium">Medium card</div>`;static ɵfac=function(i){return new(i||d)};static ɵcmp=eE({type:d,selectors:[[`app-cards`]],decls:95,vars:10,consts:[[1,`page`],[1,`page-head`],[1,`page-eyebrow`],[1,`title-big`],[1,`page-lede`],[1,`row`],[3,`variant`],[1,`extra`],[1,`title-small`],[1,`text-medium`],[1,`docs`],[1,`title-medium`],[`block`,``],[1,`table-wrap`]],template:function(i,o){i&1&&(Go(0,`div`,0)(1,`header`,1)(2,`span`,2),pI(3,`Foundations`),Ka(),Go(4,`h1`,3),pI(5,`Cards`),Ka(),Go(6,`p`,4),pI(7,`Surfaces that adapt to every theme: flat, frosted glass or soft neumorphic, from the same markup.`),Ka()(),Go(8,`div`,5),bE(9,b,5,3,`nc-card`,6,CE),Ka(),Go(11,`div`,5)(12,`nc-card`,7)(13,`h3`,8),pI(14,`Custom class and style`),Ka(),Go(15,`p`,9),pI(16,`Padding, radius and colors set through [style].`),Ka()()(),Go(17,`section`,10)(18,`h2`,11),pI(19,`How to use`),Ka(),Go(20,`p`,9),pI(21,` The card is an Angular component with the element selector `),Go(22,`app-code`),pI(23,`nc-card`),Ka(),pI(24,`. It is a block container with a background, border, rounded corners and a default padding of `),Go(25,`app-code`),pI(26,`1rem`),Ka(),pI(27,`. Put anything inside it. `),Ka(),Go(28,`h3`,8),pI(29,`1. Import it`),Ka(),Go(30,`app-code`,12),pI(31),Ka(),Go(32,`h3`,8),pI(33,`2. Use it`),Ka(),Go(34,`app-code`,12),pI(35),Ka(),Go(36,`h3`,8),pI(37,`Inputs`),Ka(),Go(38,`div`,13)(39,`table`)(40,`thead`)(41,`tr`)(42,`th`),pI(43,`Input`),Ka(),Go(44,`th`),pI(45,`Values`),Ka(),Go(46,`th`),pI(47,`Default`),Ka(),Go(48,`th`),pI(49,`Description`),Ka()()(),Go(50,`tbody`),bE(51,E,12,4,`tr`,null,f),Ka()()(),Go(53,`app-code`,12),pI(54),Ka(),Go(55,`h3`,8),pI(56,`Class and style`),Ka(),Go(57,`p`,9),pI(58,` Add your own `),Go(59,`app-code`),pI(60,`class`),Ka(),pI(61,` and `),Go(62,`app-code`),pI(63,`[style]`),Ka(),pI(64,` like on any element. Classes are merged with the card's classes. A class only overrides a card style if its CSS comes later or is more specific. Styles in `),Go(65,`app-code`),pI(66,`[style]`),Ka(),pI(67,` are inline, so they always win. `),Ka(),Go(68,`app-code`,12),pI(69),Ka(),Go(70,`h2`,11),pI(71,`How to modify it`),Ka(),Go(72,`p`,9),pI(73,` Colors and spacing come from `),Go(74,`app-code`),pI(75,`--card-*`),Ka(),pI(76,` variables defined in `),Go(77,`app-code`),pI(78,`:root`),Ka(),pI(79,` in `),Go(80,`app-code`),pI(81,`ncss.css`),Ka(),pI(82,`. Change a variable and every card follows, or set it on a parent element to change only the cards inside it. `),Ka(),Go(83,`app-code`,12),pI(84),Ka(),Go(85,`p`,9),pI(86,`Available variables:`),Ka(),Go(87,`app-code`,12),pI(88),Ka(),Go(89,`h3`,8),pI(90,`Plain CSS classes`),Ka(),Go(91,`p`,9),pI(92,`The component only toggles CSS classes, so you can use them without it.`),Ka(),Go(93,`app-code`,12),pI(94),Ka()()()),i&2&&(_y(9),NE(o.variants),_y(3),tI(TI(9,v)),_y(19),mp(o.importCode),_y(4),mp(o.usageCode),_y(16),NE(o.inputs),_y(3),mp(o.bindingCode),_y(15),mp(o.classStyleCode),_y(15),mp(o.variablesCode),_y(4),mp(o.variablesList),_y(6),mp(o.classesCode))},dependencies:[Fs,w],styles:[`.page[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:2rem;padding:2rem}.row[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;align-items:stretch;gap:2rem}.row[_ngcontent-%COMP%]   nc-card[_ngcontent-%COMP%]{flex:1 1 12rem}.docs[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:1rem;max-width:50rem;margin-top:2rem}.docs[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{margin-top:1.5rem}.docs[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin-top:1rem}.docs[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{padding-left:1.5rem}.docs[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] + li[_ngcontent-%COMP%]{margin-top:.25rem}.table-wrap[_ngcontent-%COMP%]{overflow-x:auto}table[_ngcontent-%COMP%]{border-collapse:collapse;width:100%;font-size:.875rem}th[_ngcontent-%COMP%], td[_ngcontent-%COMP%]{text-align:left;padding:.5rem .75rem;border-bottom:1px solid var(--%NS%border-color)}th[_ngcontent-%COMP%]{color:var(--%NS%gray-800)}`]})};export{S as Cards};