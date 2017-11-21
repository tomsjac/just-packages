/**
 * JUST PACKAGEs
 * CMD :
 * npm run justPackages -- --fileConf=folder/justPackages.json
 * npm run justPackages -- --no-delete-node
 */

/**
 * Package Required
 */
const fs = require('fs-extra');
const shell = require('shelljs');
const argv = require('yargs-parser')(process.argv.slice(2));

/**
 * Variables default
 */
let listPackageAtDel = [];
let hasDeleteFolderNode = true;
let fileConf = 'justPackages.json';
let folderNode = '/';
let folderOut = '/justPackages';  

/**
 * Options CMD
 */
if(argv['fileConf']){
    fileConf = argv['fileConf'];
} 
if(argv['no-delete-node']){
    hasDeleteFolderNode = false;
} 

/**
 * Check if the conf file exists
 */
if(!fs.existsSync(fileConf)){
    console.error("! File "+fileConf+" does not exist or has not been found");
    return false;
}

/**
 * Read Content : Conf file
 */
let contentPackage  = fs.readJsonSync(fileConf,{ throws: false });
if(contentPackage == null){
    console.error("! "+fileConf+" file contains errors");
    return false;
}

/**
 * Create folders if it does not exist
 */
if(typeof(contentPackage.folderNode) != 'undefined' && contentPackage.folderNode !=''){
    folderNode = contentPackage.folderNode;
}
fs.ensureDirSync(folderNode);

if(typeof(contentPackage.folderOut) != 'undefined' && contentPackage.folderOut !=''){
    folderOut = contentPackage.folderOut;
}
fs.ensureDirSync(folderOut);

/**
 * Check if you have packages to mpn
 */
if(typeof(contentPackage.packages) == 'undefined' || contentPackage.packages == ''){ 
    console.error("! No Package");
    return false; 
}

/**
 * We get the list of packages now to manage the deletion
 */
listPackageAtDel = fs.readdirSync(folderOut);

/**
 * Read the packages
 * -> start npm commands
 * -> copy the files that we need
 * -> delete the resource
 */
let packages = contentPackage.packages;
console.log('...Wait...');
for(let namePackage in packages){
    let mypack = packages[namePackage];
    let folderSourcePack = folderNode+'/node_modules/'+namePackage+'/';

    console.log();
    console.log('##### Package installation: '+namePackage+'@'+mypack.version+' #####');
    shell.exec('npm --prefix '+folderNode+' install '+namePackage+'@'+mypack.version+' --no-save', {silent:true});

    //copy files
    if(fs.existsSync(folderSourcePack)){
        for(let f in mypack.getFiles){
            let folderSource = folderSourcePack+mypack.getFiles[f];
            let folderDest = folderOut+'/'+namePackage+'/'+mypack.getFiles[f];
            
            console.log('Copy files into '+folderDest);
            fs.copySync(folderSource, folderDest);
        }
    }else{
        console.error('! Package sources: '+namePackage+' not found');
    }
    //Deleting the package from the list
    listPackageAtDel.splice(listPackageAtDel.indexOf(namePackage), 1);
}

/**
 * Deleting the node_modules folder
 */
if(hasDeleteFolderNode == true){
    shell.rm('-rf', folderNode+'/node_modules');
    shell.rm('-rf', folderNode+'/etc');
}

/**
 * Deleting more useful packages
 */
for(let iD in listPackageAtDel){
    console.log();
    console.log('##### Delete package : '+listPackageAtDel[iD]+' #####');
    shell.rm('-rf', folderOut+'/'+listPackageAtDel[iD]);
}