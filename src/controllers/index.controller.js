const indexCheck = (req,res) => {
    res.status(200).json({success:true,message:"Welcome to backend kit"})
}

export default indexCheck