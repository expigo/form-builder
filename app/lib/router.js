export default class Router {
    constructor(app) {
        this.app = app;
        this.paths = []; // wouldn't a map be better (or even set maybe due to unique entries)?
        // handle hashchange

        this.switchComponent = this.switchComponent.bind(this);
        ['hashchange', 'DOMContentLoaded'].forEach(e => window.addEventListener(e, this.switchComponent));

    }

    addRoute(name, path) {
        this.paths.push({ name, path });
    }

    switchComponent() {

        console.log('swtching components...');
        const hash = window.location.hash;
        console.log(hash);
        const route = this.paths.filter(path => hash.match(new RegExp(path.path)))[0];
        console.log(route);
        console.log(this.paths);
        // const route = this.paths[0];

        if(route) {
            this.app.renderComponent(route.name);
        } else {
            this.app.renderComponent();
        }
    }
}