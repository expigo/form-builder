export default class Welcome {
  constructor() {
    this.name = "welcome";


  }


render() {

        const html =  `
        <div class="welcome">
            <div class="highlight welcome__message">
                WITEJ. TUKEJ MOŻESZ ZŁONACZYĆ FAJNO FORMA Z MNIYJSZYCH TAJLI, JAK CI SIE INO PODOBO.
            </div>
        </div>
        `;

        return {html};
  }
}
