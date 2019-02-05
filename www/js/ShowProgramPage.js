class ShowProgramPage extends Component {

    constructor(props) {
        super(props);
        this.addRoute('/show-program', 'Visningar');
        this.addEvents({ 'click .select-program': 'selectProgram' });
        this.programs = [];
        this.generateProgramsList();
        this.selectedProgram = {};
    }

    async generateProgramsList() {
        this.programs = await Program.find(`.find().populate('movie auditorium').sort({date: 1, time: 1}).limit(10).exec()`);
        this.render();
    }


    // setSelectedProgram(program) {
    //     this.selectedProgram = program;
    //     // this.salongSelector = new SalongSelector(program);
    //     this.render();
    //   }
    async selectProgram() {
        let programId = this.baseEl.find('.select-program').data("id")
        console.log(programId)
        this.selectedProgram = await Program.find(`.findOne({ _id: '${programId}'}).populate({

            path: 'Program', select: 'program -_id', }).populate({
              path: 'Movie',select: 'title - _id'
          }).exec()`);
         this.showProgram = new ShowProgramPage(this.selectProgram);
        this.render();
    }

}