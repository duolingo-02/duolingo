const Language = require('../models/language.model')

const getALllLanguage = async (req, res) => {
    try {
      const languages = await Language.findAll();
      return res.status(200).json(languages); 
    } catch (error) {
      console.error('Error fetching languages:', error);
      return res.status(500).json({ message: 'Failed to fetch languages', error: error.message })
    }
  }
module.exports=  {getALllLanguage}



