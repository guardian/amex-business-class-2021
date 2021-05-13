// if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"
// if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"
import { render, h, Fragment } from "preact";
import { useEffect } from "preact/hooks";
import SocialBar from 'shared/js/SocialShare';
import {$, $$} from 'shared/js/util';
import RelatedContent from "shared/js/RelatedContent";
import {gsap, Sine} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import AudioPlayer from "shared/js/AudioPlayer";
import {createStore, applyMiddleware, combineReducers} from "redux";
import thunk from "redux-thunk";
import {Provider, useSelector, useDispatch} from "react-redux";

const initialState = {
    dataLoaded: false,
    sheets: null
};

const 
    ACTION_DATA_LOADED = 'action_data_loaded',
    ACTION_SET_SHEETS = 'action_set_sheets'
    ;

const setSheets = (sheets) => {
    return {
        type: ACTION_SET_SHEETS,
        payload: sheets
    };
}
const setDataLoaded = () => {
    return {
        type: ACTION_DATA_LOADED,
        payload: true
    };
}


const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_SET_SHEETS:
            return {...state, sheets: action.payload };
            break;
        case ACTION_DATA_LOADED:
            return {...state, dataLoaded: true};
        default:
            return state;
    }
}

const fetchData = (url) => {
    return  (dispatch) => {
        fetch(`${url}?t=${new Date().getTime()}`)
            .then(resp=> resp.json())
            .then((d)=>{
                console.log(d);
                dispatch(setSheets(d.sheets));
                dispatch(setDataLoaded());

            })
            // // .then(setTimeout(this.intro, 2000))
            // .then(this.intro)
            .catch(err => {
                console.log(err);
            });
        }
    
}

const store = createStore(combineReducers({rootReducer}), applyMiddleware(thunk));

gsap.registerPlugin(ScrollTrigger);


const Title = () => {
    const data = useSelector(s=>
        s.rootReducer.sheets ? s.rootReducer.sheets.global[0].headline : null 
    );
    return (
        <div className="main-title"> 
            <h1 className="text-bg"><span>{data}
            </span></h1>

        </div>        
    )
}

const StandFirst = () => {
    const data = useSelector(s=>s.rootReducer.dataLoaded? s.rootReducer.sheets.global[0].standfirst : '');
    return (
        <article>
            <div className="body stand-first" dangerouslySetInnerHTML={{__html: data}}></div>
        </article>
    )
}

const Article = ({audio, bgColour, body, headerImage, heading}) => {
    return (

    <article style={{backgroundColor: bgColour}}>
        <header >
            <div className="feature" style={{
                backgroundImage: `url(<%= path %>/${headerImage})`
            }}></div>
            <div className="title" style={{color: bgColour}}>
                <h1 className="text-bg">
                    <span dangerouslySetInnerHTML={{__html: heading}}></span>
                </h1>
            </div>
        </header>
        <div className="body" dangerouslySetInnerHTML={{__html: body}}>
        </div>

    </article>        
    )
}

const ArtileList = () => {
    const articles = useSelector(s=>s.rootReducer.sheets.articles);

    if (articles) {
        return (
            <Fragment>
                {articles.map((v, i)=> <Article {...v} key={i} />)}
            </Fragment>
        )
    }
}

const CTA = () => {
    const data = useSelector(s=>s.rootReducer.dataLoaded? s.rootReducer.sheets.global[0].cta : '')
    return (
        <article>
            <div className="body cta" dangerouslySetInnerHTML={{__html: data}}>

            </div>
        </article>
    )
}

const Socials = () => {
    const data = useSelector(s=>s.rootReducer.dataLoaded? s.rootReducer : '');
    return (
        <div className="social-share" id="ShareMe">
            <SocialBar 
                url={data.sheets.global[0].shareUrl}
                title={data.sheets.global[0].shareTitle}
            />
        </div>        
    )
}


const Amex = () => {

    useSelector(s=>console.log(s));
    // const fetcher = useSelector(s=> s.fetchData);

    const dataLoaded = useSelector(s=>s.rootReducer.dataLoaded);

    const dispatch = useDispatch();

    useEffect(()=>{
        // fetchData();
        // fetcher('https://interactive.guim.co.uk/docsdata/1YJuvtQuxlx7_gqAnBvicOIfs6JmU7ctfSvKMrgar7Wg.json');
        dispatch(fetchData
            ('https://interactive.guim.co.uk/docsdata/1YJuvtQuxlx7_gqAnBvicOIfs6JmU7ctfSvKMrgar7Wg.json'));
    },[]);


    const loaded = () => 
            <main>
                <header>
                    <div className="flex-container">
                        <div className="bg"
                            style="background-image: url('<%= path %>/hero.jpg');">
                        </div>
                        <div className="ClientDetails">
                            <span>Paid for By</span>
                            <a href="" target="_blank" rel="noopener noreferrer">
                                <img
                                src="<%= path %>/logo.png"
                                width="140"
                                alt="AMEX" />
                            </a>
                        </div>
                    </div>
                </header>
                <Title />
                <StandFirst />
                <ArtileList />
                <CTA />
                <div className="break">
                    <hr/>
                    <hr/>
                    <hr/>
                    <hr/>
                </div>
                <Socials />
                
            </main>

    

    const loading = (
        <span></span>
    )

    // return dataLoaded ? loaded() : loading;
    if (dataLoaded) return loaded()
    else return loading;
}

const App = () => {

    return (
        <Provider store={store}>
            <Amex />
        </Provider>

    )
}

render( <App/>, document.getElementById('Glabs'));

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
    // const app = new AppMain('https://interactive.guim.co.uk/docsdata/1YJuvtQuxlx7_gqAnBvicOIfs6JmU7ctfSvKMrgar7Wg.json');

});

