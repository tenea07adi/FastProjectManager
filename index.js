const _windowsControll = require('./utility/windowsControll.js')
var $ = jQuery = require("jquery")

let winControll = new _windowsControll();


let panelsList = [
    {
        id: "panel-1",
        button: "panel1Button"
    },
    {
        id: "panel-2",
        button: "panel2Button"
    },
    {
        id: "panel-3",
        button: "panel3Button"
    }
];

let dataFilePrototype = {
    projects: [
        {  
            id: "0",
            author: "YOUR NAME",
            title: "YOUR PROJECT TITLE",
            projectPath: "c:\\YOUR_PROJECT_PATH",
            description: "YOUR PROJECT DESCRIPTION",
            tags: ["Project 1"]
        }
    ]
}

LoadDefaultEvents();

MapPanelButtonsEvents(panelsList);
SwitchPanels("panel-1");

let dataFilePath = "C:\\temp" + "\\fpmLocalStorage" + ".json";

let projects = LoadProjectsTable();



function LoadProjectsTable(){
    let projects = ReadProjectsFromLocalStorage(dataFilePath);
    $("#projectsTable").html(GenerateProjectsTable(projects));
    MaProjectEvents(projects);
    return projects;
}

function GenerateProjectsTable(projects){
    let table = `<table class="table"><thead><tr><th scope="col">#</th><th scope="col">Id</th><th scope="col">Title</th><th scope="col">Author</th><th>Path</th><th>Open</th></tr></thead><tbody>`

  projects.forEach((project, index) => {
    let newRow = `<tr><td>${index}</td> <td>${project.id}</td> <td>${project.title}</td> <td>${project.author}</td> <td>${project.projectPath}</td> <td><button class="btn btn-primary" id="openProject-${project.id}">Open</button> <button class="btn btn-danger" id="deleteProject-${project.id}">Delete</button></td> </tr>`;
    table += newRow;
  })

  table += `</tbody> </table>`;

  return table;
}

function OpenVscodeProject(path){
    //console.log(path);
    let baseCommand = `code -n `; // code -n G:\TENCODE\CLIENTI\GplCraiova\web\07-2022

    path.replaceAll(" ", "\ ");

    winControll.run_cmd_command(baseCommand + '"' + path + '"');
}

function ReadProjectsFromLocalStorage(path){
    try{
        let fileData = JSON.parse(winControll.read_file(path));
        return fileData.projects;
    } catch {
        try{
            winControll.write_file(path, JSON.stringify(dataFilePrototype))
            let fileData = JSON.parse(winControll.read_file(path));
            return fileData.projects;
        } catch(err) {
            // ERROR
            console.log(err);
            return null;
        }
    }
}



function MaProjectEvents(projects){

    projects.forEach(project => {
        $(`#openProject-${project.id}`).click(function(){
            OpenVscodeProject(project.projectPath);
        })

        $(`#deleteProject-${project.id}`).click(function(){
            DeleteProject(project.id);
        })
        
      })


}

function MapPanelButtonsEvents(panelsList){
    panelsList.forEach(panel => {
        $(`#${panel.button}`).click(function(){
            SwitchPanels(panel.id);
        })
      })
}


function SwitchPanels(openPanelId){
    panelsList.forEach(panel => {
        if(panel.id == openPanelId){
            $("#" + panel.id).css('display', 'block');
        } else {
            $("#" + panel.id).css('display', 'none');
        }
    })
}

function AddProject(project){
    try{
        let fileData = JSON.parse(winControll.read_file(dataFilePath));
        fileData.projects.push(project);
        winControll.write_file(dataFilePath, JSON.stringify(fileData));
    } catch {
        try{
            winControll.write_file(dataFilePath, JSON.stringify(dataFilePrototype))
            let fileData = JSON.parse(winControll.read_file(dataFilePath));
            fileData.projects.push(project);
            winControll.write_file(dataFilePath, JSON.stringify(fileData));
        } catch (err) {
            // ERROR
            console.log(err);
            return null;
        }
    }
}

function LoadDefaultEvents(){
    $(`#submitNewProjectButton`).click(function(){

        //let newId = ($("#title").val().trim() + $("#projectPath").val()) + Math.round(Math.random() * 10000);
        //newId = newId.replaceAll(" ", "");
       // newId = newId.replaceAll("\\", "-");

        let current = new Date();

        let newId = '' + ($("#title").val().trim() + $("#projectPath").val()).length + current.getSeconds() + current.getMinutes() + current.getHours() + current.getDate() + Math.round(Math.random() * 10000);

        let newProject = {
            "id": newId,
            "author": $("#author").val(),
            "title": $("#title").val(),
            "projectPath": $("#projectPath").val(),
            "description": $("#description").val()
        }

        AddProject(newProject);

        LoadProjectsTable();

        SwitchPanels("panel-1");

        ResetFormData();
    })
}

function ResetFormData(){
    $("#author").val(""),
    $("#title").val(""),
    $("#projectPath").val(""),
    $("#description").val("")
}

function DeleteProject(id){

    let fileData = JSON.parse(winControll.read_file(dataFilePath));

    let keepProjects = [];
    
    fileData.projects.forEach(project => {
        if(project.id != id){
            keepProjects.push(project);
        }
    })

    fileData.projects = keepProjects;

    winControll.write_file(dataFilePath, JSON.stringify(fileData));

    LoadProjectsTable();
}



