const express=require('express');
const pool=require('../pool.js');
//创建路由器对象
var router=express.Router();
//添加路由
//1.注册路由
router.post('/reg',function(req,res){
  //
  var obj=req.body;
  console.log(obj);
  //如果用户名为空
  if(!obj.uname){
    res.send({code:401,msg:'uname require'});
	//结束函数执行,return可以结束函数
	return;
  }
  if(!obj.upwd){
    res.send({code:402,msg:'upwd require'});
	return;
  }
  if(!obj.phone){
    res.send({code:403,msg:'phone require'});
	return;
  }
  if(!obj.email){
    res.send({code:404,msg:'email require'});
	return;
  }
  //执行sql语句
  pool.query('insert into xz_user set?',[obj],function(err,result){
    if(err)throw err;
	//console.log(result);
	//如果插入成功
	if(result.affectedRows>0){
	  res.send({code:200,msg:'reg success'});
	}
  });

});






//2登陆路由
router.get("/login/:uname&:upwd",(req,res)=>{
	$uname=req.params.uname;
	$upwd=req.params.upwd;
	var sql="select*from xz_user where uname=? and upwd=?";
	pool.query(sql,[$uname,$upwd],(err,result)=>{
		if(err)throw err;
		if(result.length>0){
			res.send("1");
		}else{
			res.send("0");
		}
	});
});



//3.检索用户
router.get('/detail',function(req,res){

  var obj2=req.query;
  console.log(obj2);
  if(!obj2.uid){
    res.send({code:401,msg:'uid required'});	
	return;
  }
  pool.query('select * from xz_user where uid=?',[obj2.uid],function(err,result){
    if(err)throw err;
	res.send(result);
  });
});


//4.用户修改路由
router.post('/update',function(req,res){
  //4.1获取数据
  var obj3=req.body;
  console.log(obj3);
  //4.2验证数据是否为空
  var i=400;
  for(var key in obj3){
	i++;
    //console.log(key,obj[key]);
	if(!obj3[key]){
	  res.send({code:i,msg:key+'required'});
	  return;
	}

  }
  /*if(!obj3.uid){
    res.send({code:401,msg:'uid required'});	
	return;
  };
  if(!obj3.phone){
    res.send({code:402,msg:'phone required'});	
	return;
  };
  if(!obj3.email){
    res.send({code:403,msg:'email required'});	
	return;
  };
  if(!obj3.user_name){
    res.send({code:404,msg:'user_name required'});	
	return;
  };
  if(!obj3.gender){
    res.send({code:405,msg:'gender required'});	
	return;
  };*/

  //4.3执行sql语句
  //取出用户编号
  var uid=obj3.uid;
  //删除对象中的uid属性
  delete obj3.uid;
  pool.query('update xz_user set ? where uid=?',
  [obj3,uid],function(err,result){
    if(err)throw err;
	//console.log(result);
	
	if(result.affectedRows>0){
	  res.send({code:200,msg:'update success'});
	}else{
	  res.send({code:201,msg:'update failure'});
	}
  });  
});

//5分页查询路由
//5.1获取数据
router.get('/list',function(req,res){
  var obj=req.query;
  console.log(obj);

//5.2如果为空设置默认值，大小为空设置2，页码为空设置1
var count=obj.count;
var pno=obj.pno;
if(!count){
  count=2;
}
if(!pno){
  pno=1;
}
console.log(count,pno);
//5.3将值转为整型
count=parseInt(count);
pno=parseInt(pno);
//5.4计算开始的值=（页码-1）*大小
var start=(pno-1)*count;//页码减一乘以每页大小
//5.5执行sql语句
pool.query('select*from xz_user limit ?,?',[start,count],function(err,result){
  if(err)throw err;
  res.send(result);
});
});

//6数据删除路由
router.get('/delete',function(req,res){
  var obj=req.query;
  console.log(obj);
  if(!obj.uid){
    res.send({code:401,msg:'uid required'});
	return;
  }
  pool.query('delete from xz_user where uid=?',[obj.uid],function(err,result){
    if(err)throw err;
	if(result.affectedRows>0){
	  res.send({code:200,msg:'delete success'});
	}else{
	  res.send({code:201,msg:'delete failure'});
	}
  })

});

//导出路由器对象
module.exports=router;