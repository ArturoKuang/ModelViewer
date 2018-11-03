const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoLevel").val() == ''){
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });

    return false;
};

// create React JSX for Add Domo form
const DomoForm = (props) => {
    return(
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
        
        <label htmlFor="name">Name: </label>
        <input id ="domoName" type="text" name="name" placeholder="Domo Name"/>
        <label htmlFor="age"> Age: </label>
        <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
        <label htmlFor="level"> Level: </label>
        <input id="domoLevel" type="text" name="level" placeholder="Domo Level"/>
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

const DomoList = function(props){
    // no domos exist 
    if(props.domos.length === 0){
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }

    // map function to create UI for EACH domo stored
    // every domo will generate a domo Div and add it to domoNodes
    // advantage is that we can update the sate of this component via Ajax.
    // everytimes the state updates, the page will immediately create UI and show the updates
    const domoNodes = props.domos.map(function(domo) {
        console.dir(domo);
        return(
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Name: {domo.name} </h3>
                <h3 className="domoAge"> Age: {domo.age} </h3>
                <h3 className="domoAge"> Level: {domo.level} </h3>
            </div>
        );
    });

    return(
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

// add function to grab domos from the server and reder a DomoList
// will need to periodically update the screen with changes(without siwtching pages)
// since ajax is asynchronous, we will need to do the rendering on the success of the
// ajax call and pass in the data we get from the server
const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#domos")
        );
    });
};

// setup function takes a CSRF token in client/maker.js
// function will render out DomoForm to the page and a default domo list
const setup = function(csrf){
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

    // domos attribute is empty for now, because we don't have data yet. But
    // it will at least get the HTML onto the page while we wait for the server
    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#domos")
    );

    loadDomosFromServer();
};

// allows us to get new CSRF token for new submissions
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function(){
    getToken();
});