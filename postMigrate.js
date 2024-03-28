const fs = require('fs-extra');
const path = require('path');


const postMigrate = async () => {
    const buildContractsPath = path.resolve(__dirname, 'build', 'contracts');
    const srcContractsPath = path.resolve(__dirname, 'client', 'src', 'contracts');
    const contractFileName = 'Certificate.json';
    console.log(srcContractsPath)

    try {

        const exists = await fs.pathExists(path.resolve(buildContractsPath, contractFileName));
        if (!exists) {
            console.error(`${contractFileName} not found in the build/contracts directory.`);
            return;
        }


        await fs.copy(path.resolve(buildContractsPath, contractFileName), path.resolve(srcContractsPath, contractFileName));
        console.log(`${contractFileName} copied successfully to the src/contracts directory.`);
    } catch (error) {
        console.error('Error copying Certificate.json:', error);
    }
};

postMigrate();
