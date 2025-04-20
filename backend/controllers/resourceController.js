const resourceModel = require("../models/resourceModel")

const addResource = async (req, res) => {
    
    try {
        if(!req.file){
            return res.status(400).json({message: 'Upload Documentation'})
        }

        const filePath = req.file.path

        const resource = {
            title: req.body.title,
            description: req.body.description,
            document: filePath
        }

        const createdResource = await resourceModel.create(resource)

        console.log(createdResource);
        
        return res.status(200).json('Uploaded')
        
    } catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server Error')
    }
}

const getResources = async (req, res) => {
    try {
        const resources = await resourceModel.find({})
        return res.status(200).json({success: true, resources: resources})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error Occured'})
    }
}



module.exports = {addResource, getResources}