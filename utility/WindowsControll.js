var fs = require("fs");
const child_process = require('child_process');

class WindowsControll{

    read_file = function(path){
        return fs.readFileSync(path, 'utf8');
    }

    write_file = function(path, output){
        fs.writeFileSync(path, output);
    }

    run_cmd_command(command){
        child_process.exec(command);
    }

}

module.exports = WindowsControll;



