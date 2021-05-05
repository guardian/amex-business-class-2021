// if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"
// if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"
import { render, h } from "preact";
import SocialBar from 'shared/js/SocialShare';
import {$, $$} from 'shared/js/util';
import RelatedContent from "shared/js/RelatedContent";
import {gsap, Sine} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import AudioPlayer from "shared/js/AudioPlayer";


gsap.registerPlugin(ScrollTrigger);

class AppMain {

    constructor(url) {
        console.log('construct', url);

        fetch(`${url}?t=${new Date().getTime()}`)
            .then(resp=> resp.json())
            .then(this.init)
            // .then(setTimeout(this.intro, 2000))
            .then(this.intro)
            .catch(err => {
                console.log(err);
            });
    }
        
    init(data) {
        console.log(this, data, document.getElementById('ShareMe'));
        const sheet = data.sheets.global[0];

        render(<SocialBar 
            url={data.sheets.global[0].shareUrl}
            title={data.sheets.global[0].shareTitle}
        />, document.getElementById('ShareMe'));

        $$('[data-dyn]').forEach((el) => {
            // console.log(el)
            el.innerHTML = sheet[el.dataset.dyn];
        });

        // $('body').addEventListener('click', e => {
        //     console.log(e);
        // });

        render(<RelatedContent cards={data.sheets.related} />, $('.related'));

        $$('.grid a, .related a').forEach(link => {
            link.setAttribute('target', '_blank');
        });

        render( <AudioPlayer title="Les Shern on dealing with his diagnosis" src="<%= path %>/audio/clip_1_auspost.mp3" subs="<%= path %>/audio/clip_1_auspost.vtt" />, document.getElementById('aud1'));
    }
    
    intro() {
        // gsap.from('#Glabs', {duration: 2, autoAlpha: 0, delay: 1});
        gsap.from('header h1', {y: 20, alpha: 0, delay: 2});

        $$('.vis.pleft').forEach((target) => {
             ScrollTrigger.create({
                trigger: target,
                start: 'top 100%',
                scrub: 1.2,
                animation: gsap.to(target, {delay: 0.3, x: "-10%", ease: Sine.easeInOut}),
                // markers: true
            })

        });
        $$('.vis.pright').forEach((target) => {
            gsap.set(target, {x: "-20%"});
             ScrollTrigger.create({
                trigger: target,
                start: 'top 100%',
                scrub: 1.2,
                animation: gsap.to(target, {delay: 0.3, x: "-10%", ease: Sine.easeInOut}),
                // markers: true
            })

        });

        Array.from($$('.content p')).forEach((child) => {
                
                ScrollTrigger.create({
                    trigger: child,
                    start: 'top 100%',
                    end: 'top 50%',
                    scrub: 1,
                    animation: gsap.from(child, {alpha: 0, x: 40, ease: Sine.easeInOut})
                })

            });

        // $$('.content').forEach(target => {
        //     console.log(target)
        //     ScrollTrigger.create({
        //         target: target,
        //         start: 'top top',
        //         end: '+=200',
                
        //         scrub: .2,
        //         animation: gsap.from(target.querySelectorAll('p'), {alpha: 0, ease: Sine.easeInOut, stagger: 0.2}),
        //         markers: true
        //     })

        //     Array.from(target.querySelectorAll('p')).forEach(child => {
        //         // console.log(child);
        //         // ScrollTrigger.create({
        //         //     target: child,
        //         //     start: 'top 100%',
        //         //     // end: 'top 50%',
        //         //     scrub: .2,
        //         //     animation: gsap.from(child, {alpha: 0, ease: Sine.easeInOut})
        //         // })

        //     });


        // });

    }

}

window.addEventListener('load', e => {
    // https://docs.google.com/spreadsheets/d/1YJuvtQuxlx7_gqAnBvicOIfs6JmU7ctfSvKMrgar7Wg/edit?usp=sharing
    const app = new AppMain('https://interactive.guim.co.uk/docsdata/1YJuvtQuxlx7_gqAnBvicOIfs6JmU7ctfSvKMrgar7Wg.json');

});

