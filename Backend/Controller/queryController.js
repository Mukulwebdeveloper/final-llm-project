const Query = require("../Model/QueySchema");

//register a new query
exports.newquery = async (req, res) => {
    try {
        console.log(req.body);
        // const data={
        //     "userId":"65f6824c7041bdc6bfe5bb74",
        //     "Answer":"this is samle answer",
        //     "query":"this is sample question",
        //     "Documents":["assdsdsd","dsdsdsdsd"]
        // }
        const query =await  Query.create(req.body);
        console.log(query);
        res.status(200).json({succes:true,query});
    } catch (err) {
        res.status(500).json(err);
    }
}

// update feedback for any query
exports.feedbackUpdate=async(req,res)=>{
    try {
        const {id,formdata}=req.body;
        console.log(req.body)
        const query=await Query.findById(id);
        query.feedback=formdata;
        await query.save();
        res.status(200).json({succes:true,query});
    } catch (error) {
        res.status(500).json(error);
        
    }
}
exports.removeQuery=async(req,res)=>{
    const { _id } = req.body;

  try {
    const deletedQuery = await Query.findByIdAndDelete(_id);
    if (!deletedQuery) {
      return res.status(404).json({ message: 'No document found with that ID' });
    }
    res.status(200).json({ message: 'Deleted successfully', deletedQuery });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

//get all query of any user
exports.getuserQuery=async(req,res)=>{
    try {
        const {userId}=req.body;
        console.log(userId)
        const response=await Query.find({userId});
        console.log(response);
        res.status(200).json({succes:true,response});
        
    }
    catch(error){
        res.status(500).json(error);
    }
}