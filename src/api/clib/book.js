import request from '@/utils/request'


//部分接口通用
let prefixDict = '/api-cloudlib/cloudlib-admin/sys/dict/getDictByType/' //字典
let prefix  = '/api-cloudlib/cloudlib-admin/different/book/upper/'        //好书推荐
let trad = '/api-cloudlib/cloudlib-admin/trad/'
let catalog = '/api-cloudlib/cloudlib-admin/functionCatalog/functioncatalog/'    //栏目管理
let inheritance = '/api-inheritance/inheritance/'; //推荐人

// -----------------------图书管理 start--------------------------------

/*******************好书推荐 start **************************/
/**
 * 好书推荐分页查询
 *1	limit	                    分页参数：每页多少条数据	        	                  [string]
 *2	page	                    分页参数：第几页	              	                  [string]
 *3	periodName	              期次名字		                                      [string]
 *4	examineStatus	            审核状态（0-未审核；1-已审核；2-已驳回；3-已发送）	  	[int]
 *5	publishStatus           	发布状态 0未发布 1已发布	        	                [string]
 *6	venueName	                场馆名称	                      	                [string]
 * */

export function getPeriod (params) {
  return request({
    url: prefix + 'good/period',
    method: 'get',
    params
  })
}

/**
 * 新增期次
 *1	periodName	                  	期次名字	        	                          [string]
 *2	venueNum	                      场馆编码	              	                    [long]
 *3	periodType	                    期次类型（0-馆长推荐,1-新书上架,2-好书推荐,默认传2  [int]                                      [string]
 * */
export function save(data) {
  return request({
    url: trad+'bookperiod/save',
    method:'POST',
    data
  })
}


/**
 * 好书推荐修改
 *1	id	         主键id	     [long]
 *2	periodName   栏目期次名称  [string]
 * */
export function update(data) {
  return request({
    url: trad+'bookperiod/update',
    method: 'POST',
    data
  })
}


/**
 * 好书推荐删除
 *1	id	         主键id	     [long]
 * */
export function deleteById(data) {
  return request({
    url: trad+'bookperiod/deleteById',
    method: 'POST',
    data
  })
}
/**
 * 根据id获取当前期次所属图书列表
 * periodId	期次推荐id	是	[string]
* */

export function getRecords(params) {
  return request({
    url: prefix+'records',
    method: 'GET',
    params
  })
}


/**
 * 发送审核
 * id	主键id	是	[string]
 * */

export function sendExamine(data) {
  return request({
    url: trad+'bookperiod/sendExamine',
    method: 'POST',
    data
  })
}


/**
 * 期次审核
 1  id	                  主键id	        	[long]
 2	examineStatus	        审核状态		      [int]
 3	examineOpinion	      审核意见		      [string]
 * */

export function examine(data) {
  return request({
    url: trad+'bookperiod/examine',
    method: 'POST',
    data
  })
}



/**
 * 期次类型枚举
 *
 * */

export function getEnums() {
  return request({
    url: trad+'bookperiod/type/enums',
    method: 'GET',
  })
}



/**
 * 审核状态枚举
 *
 * */

export function getAuthStatus() {
  return request({
    url: trad+'bookperiod/examine/enums',
    method: 'GET',
  })
}


/**
 * 获取详情
 *
 * */

export function detail(id) {
  return request({
    url: trad+'bookperiod/info/'+id,
    method: 'GET',
  })
}



/**
 * 发布/撤销好书推荐
 *1	id	          主键id	是                 	[string]
 2	publishStatus	发布状态 0未发布 1已发布	是	[string]
 * */

export function publish(data) {
  return request({
    url: trad+'bookperiod/publish',
    method: 'POST',
    data
  })
}


/**
 * 书库搜索类型枚举
 *
 * */

export function bookType() {
  return request({
    url: prefixDict+'BOOK_SEARCH',
    method: 'GET',
  })
}



/**
 * 书库图书搜索
 1	page	        分页参数                              	是	[string]
 2	limit	        分页参数                              	是	[string]
 3	searchFiled 	搜索类型（title-书名；author-作者；isbn）	是	[string]
 4	searchWord	  搜索关键字                            	是	[string]
 5	libcode	      市馆编码	                              是	[string]
 * */

export function booksRecord(params) {
  return request({
    url: trad+'bookperiodrecord/books',
    method: 'GET',
    params
  })
}



/**
 * 好书推荐新增图书
 1	idBookPeriod	                  推荐期次外键	        是	[long]		查看
 2	idBookInformation	              图书信息外键        	是	[long]
 3	recommendedSort	                推荐排序	            是	[string]		查看
 4	bookName	                      书名	                是  [string]		查看
 5	seriesName	                    从书名	              是	[string]		查看
 6	recordId	                      原始数据第三方键	      是	[string]		查看
 7	catalog	                        目录                	是	[string]
 8	bookCallNo	                    图书编号            	是	[string]		查看
 9	translator	                    编译人             	是	[string]
 10	summary	                        摘要	                是 	[string]		查看
 11	sourceFrom	                    图书来源             	是	[string]
 12	browseVolume	                  浏览量             	是	[string]
 13	subject	                        主题                	是	[string]		查看
 14	bookCover	                      封面图片地址        	是	[string]
 15	author	                        作者                	是	[string]		查看
 16	isbn	                          isbn                是	[string]		查看
 17	publisher	                      图书出版社           	是	[string]		查看
 18	bookPrice	                      图书价格            	是	[string]
 19	publishDate                    	图书出版日期        	是	[string]		查看
 20	language	                      语种                	是	[string]
 21	bookTag	                        图书标签 多个已逗号隔开形式	是	[string]
 * */

export function create(data) {
  return request({
    url: prefix+'create',
    method: 'POST',
    data
  })
}



/**
 * 更新图书
 1	recordId	        所属图书记录id	是	[string]		查看
 2	recommendedSort	  推荐排序	是	[string]		查看
 3	sourceFrom      	来源	是	[string]		查看
 4	author          	作者	是	[string]		查看
 5	bookTag         	标签	是	[string]		查看
 6	summary         	摘要	是	[string]

 * */

export function change(data) {
  return request({
    url: prefix+'info/change',
    method: 'PUT',
    data
  })
}



/**
 * 移除此书
 * 1	id	记录id	是	[long]
 * */

export function deleteRecord(data) {
  return request({
    url: trad+'bookperiodrecord/delete/'+data.id,
    method: 'PUT',
    data
  })
}
/*******************好书推荐 end **************************/



/*******************新书上架 start **************************/

/**
 * 新书上架新增期次
 1	periodName	      期次名称	  是	[string]		查看
 2	periodType	      期次类型:0-馆长推荐 1-新书上架 2-好书推荐（此处默认为1）	是	[string]		查看
 3	venueNum	        场馆编码	是	[string]		查看
 4	institutionId	    场馆id	是	[string]
 * */

// export function newSave(data) {
//   return request({
//     url: prefix+'cloudlib-admin/trad/bookperiod/save',
//     method: 'POST',
//     data
//   })
// }



/**
 * 根据id获取详情
 * 1	id	期次主键	是	[string]
 * */

// export function newInfo(data) {
//   return request({
//     url: prefix+'cloudlib-admin/trad/bookperiod/info/'+data.id,
//     method: 'GET',
//     data
//   })
// }


/**
 * 新书上架列表查询
 1	limit           	分页参数	是	[string]
 2	page	            分页参数	是	[string]
 3	periodName	      期次名称		[string]
 4	examineStatus    	审核状态		[string]
 5	publishStatus   	发布状态		[string]
 6	venueName       	场馆名称		[string]
 * */

export function booksNewList(params) {
  return request({
    url: prefix+'new/period',
    method: 'GET',
    params
  })
}


/**
 * 期次编辑修改
 1	id	        主键id	  是	[string]		查看
 2	periodName	期次名称	是	[string]
 * */

// export function newUpdate(data) {
//   return request({
//     url: prefix+'cloudlib-admin/trad/bookperiod/update',
//     method: 'POST',
//     data
//   })
// }


/**
 * 删除期次
 1	id	期次id	是	[long]
 * */

// export function newDelete(data) {
//   return request({
//     url: prefix+'cloudlib-admin/trad/bookperiod/deleteById',
//     method: 'POST',
//     data
//   })
// }


/**
 * 根据id获取推荐列表
 * periodId	期次id	是	[string]
 * */

// export function getNewRecords(params) {
//   return request({
//     url: prefix+'records',
//     method: 'GET',
//     params
//   })
// }



/**
 * 新增图书
 1	idBookPeriod	          推荐期次外键	是	[string]		查看
 2	idBookInformation     	图书信息外键	是	[string]
 3	recommendedSort	        推荐排序	是	[string]		查看
 4	bookName	              书名	是	[string]		查看
 5	seriesName	            从书名	是	[string]		查看
 6	recordId               	原始数据第三方键	是	[string]		查看
 7	catalog	                目录	是	[string]
 8	bookCallNo            	图书编号	是	[string]		查看
 9	translator	            编译人	是	[string]
 10	summary	                摘要	是	[string]		查看
 11	sourceFrom	            图书来源	是	[string]
 12	browseVolume	          浏览量	是	[string]
 13	subject	                主题	是	[string]		查看
 14	bookCover	              封面图片地址	是	[string]
 15	author	                作者	是	[string]		查看
 16	isbn	                  isbn	是	[string]		查看
 17	publisher             	图书出版社	是	[string]		查看
 18	bookPrice             	图书价格	是	[string]
 19	publishDate	            图书出版日期	是	[string]		查看
 20	language	              语种	是	[string]
 21	bookTag	                图书标签	是	[string]
 * */

// export function newCreate(data) {
//   return request({
//     url: prefix+'cloudlib-admin/different/book/upper/create',
//     method: 'POST',
//     data
//   })
// }



/**
 * 发送审核
 *1	id	          主键id	是                 	[string]
 * */

// export function newSendAuth(data) {
//   return request({
//     url: prefix+'cloudlib-admin/trad/bookperiod/sendExamine',
//     method: 'POST',
//     data
//   })
// }



/**
 * 期次审核
 1	id	              主键id	是	[string]
 2	examineStatus   	审核状态	是	[string]
 3	examineOpinion	  审核意见		[string]
 * */

// export function newExamine(data) {
//   return request({
//     url: prefix+'cloudlib-admin/trad/bookperiod/examine',
//     method: 'POST',
//     data
//   })
// }


/**
 * 发布/撤销期次
 1	id	          主键id	是	[string]
 2	publishStatus	发布/撤销状态 0未发布 1已发布	是	[string]
 * */

// export function newPublish(data) {
//   return request({
//     url: prefix+'cloudlib-admin/trad/bookperiod/publish',
//     method: 'POST',
//     data
//   })
// }



/**
 * 更新图书
 1	recordId	      记录主键id	是	[string]
 2	recommendedSort	排序		[string]
 3	bookTag	        书签		[string]
 4	sourceFrom	    来源		[string]
 5	summary	        简介		[string]
 6	bookCover     	封面id		[string]

 * */

// export function newChange(data) {
//   return request({
//     url: prefix+'cloudlib-admin/different/book/upper/info/change',
//     method: 'PUT',
//     data
//   })
// }

/**
 * 移除此书
 * id	记录id	是	[string]
 * */


// export function newDelete(data) {
//   return request({
//     url: prefix+'cloudlib-admin/trad/bookperiodrecord/delete/'+data.id,
//     method: 'PUT',
//     data
//   })
// }
/*******************新书上架 end **************************/



/*******************馆员推荐 start **************************/

/**
 * 新增推荐期次
 1	periodName	        推荐期次名称	是	[string]		查看
 2	periodType	        期次类型:0-馆员推荐 1-新书上架 2-好书推荐（此处默认传0）	是	[string]		查看
 3	venueNum	          场馆编码	是	[string]		查看
 4	institutionId	      场馆id	是	[string]
 * */

// export function libSave(data) {
//   return request({
//     url: prefix+'cloudlib-admin/trad/bookperiod/save',
//     method: 'POST',
//     data
//   })
// }
//



/**
 * 获取期次详情
 * 1	id	期次主键	是	[string]
 * */

// export function libInfo(data) {
//   return request({
//     url: prefix+'cloudlib-admin/trad/bookperiod/info/'+data.id,
//     method: 'GET',
//     data
//   })
// }




/**
 * 期次列表查询
 1	limit         	分页参数	是	[string]
 2	page	          分页参数	是	[string]
 3	periodName    	期次名称		[string]
 4	examineStatus 	审核状态		[string]
 5	publishStatus	  发布状态		[string]
 6	venueName	      场馆名称		[string]
 * */

export function libList(params) {
  return request({
    url: prefix+'librarian/period',
    method: 'GET',
    params
  })
}


/**
 * 期次编辑修改
 1	id	        主键id	是	[string]		查看
 2	periodName	期次名称	是	[string]
 * */

// export function libUpdate(data) {
//   return request({
//     url: prefix+'cloudlib-admin/trad/bookperiod/update',
//     method: 'POST',
//     data
//   })
// }




/**
 * 推荐期次删除
 1	1	id	主键id	是	[string]
 * */

// export function libDelete(data) {
//   return request({
//     url: prefix+'cloudlib-admin/trad/bookperiod/deleteById',
//     method: 'POST',
//     data
//   })
// }




/**
 * 图书管理新增图书
 1	idBookPeriod	      推荐期次外键	是	[string]		查看
 2	curatorName	        推荐人名称	是	[string]		查看
 3	recommendedLanguage	推荐理由	是	[string]		查看
 4	recommendedSort	    推荐排序	是	[string]		查看
 5	bookName	          书名	是	[string]		查看
 6	seriesName	        从书名	是	[string]		查看
 7	recordId	          原始数据第三方键	是	[string]		查看
 8	catalog           	目录	是	[string]
 9	bookCallNo	        图书编码 索书号	是	[string]		查看
 10	translator	        编译人	是	[string]
 11	summary           	摘要	是	[string]		查看
 12	sourceFrom	        图书来源	是	[string]
 13	browseVolume	      浏览量	是	[string]
 14	subject           	subject	是	[string]		查看
 15	bookCover         	封面图片id	是	[string]
 16	author            	作者	是	[string]		查看
 17	isbn              	isbn	是	[string]		查看
 18	publisher         	图书出版社	是	[string]		查看
 19	bookPrice         	图书价格	是	[string]
 20	publishDate	        图书出版日期	是	[string]		查看
 21	language	          语种	是	[string]
 22	bookTag	            图书标签	是	[string]		查看
 23	recommendedSummary	推荐人简介	是	[string]
 * */
export function libSave(data) {
  return request({
    url: trad+'bookperiodrecord/save',
    method: 'POST',
    data
  })
}





/**
 * 根据期次id获取图书列表
 * 1	periodId	馆员推荐期次id	是	[string]
 * */

export function libRecords(data) {
  return request({
    url: prefix+'records/'+data.id,
    method: 'GET',
    data
  })
}

/**
 * cloudlib-admin/trad/booklistinfo/getBookList?pageSize=10&currPage=1&bookName=
 GET
 获取图书列表
 * @param data
 */
export function getBookList(params) {
  return request({
    url: trad+'booklistinfo/getBookList',
    method: 'GET',
    params
  })
}


/**
 * 发送审核
 *1	id	          推荐id	是	[string]
 * */

// export function libSendAuth(data) {
//   return request({
//     url: prefix+'cloudlib-admin/trad/bookperiod/sendExamine',
//     method: 'POST',
//     data
//   })
// }




/**
 * 审核
 1	id	            推荐期次id                	是	[string]		查看
 2	examineStatus	  审核状态（1-审核通过；2-驳回）	是	[string]		查看
 3	examineOpinion	审核意见	                     	[string]
 * */

// export function libExamine(data) {
//   return request({
//     url: prefix+'cloudlib-admin/trad/bookperiod/examine',
//     method: 'POST',
//     data
//   })
// }




/**
 * 发布/撤销期次
 1	id	          主键id	是	[string]
 2	publishStatus	发布状态 0未发布 1已发布	是	[string]
 * */

// export function libPublish(data) {
//   return request({
//     url: prefix+'cloudlib-admin/trad/bookperiod/publish',
//     method: 'POST',
//     data
//   })
// }



/**
 * 更新图书
 1	id	                记录id	是	[string]		查看
 2	bookName	          图书名	是	[string]		查看
 3	author	            作者	是	[string]		查看
 4	curatorName	        推荐人名称	是	[string]		查看
 5	recommendedSummary	推荐人简介	是	[string]		查看
 6	recommendedLanguage	推荐语	是	[string]		查看
 7	recommendedSort	    推荐排序	是	[string]		查看
 8	bookCover	          封面图片id	是	[string]
 9	summary           	图书简介	是	[string]		查看
 10	bookTag	            图书标签	是	[string]		查看
 11	sourceFrom	        来源	是	[string]

 * */

export function libChange(data) {
  return request({
    url: trad+'bookperiodrecord/update',
    method: 'PUT',
    data
  })
}

/**
 * 移除此书
 * id	记录id	是	[string]
 * */


// export function libDelete(data) {
//   return request({
//     url: prefix+'cloudlib-admin/trad/bookperiodrecord/delete/'+data.id,
//     method: 'PUT',
//     data
//   })
// }
/*******************馆员推荐 end **************************/

/*******************图书排行 start **************************/
/**
 * 图书排行分页查询
 1  limit	                分页参数	是	[string]
 2	page	                分页参数	是	[string]
 3	periodName        	  期次名称（筛选条件）		[string]
 4	publishStatus	        发布状态（筛选条件---0未发布 1已发布）		[string]
 5	periodChildType	      排行类型（筛选条

 * */
export function getRank (params) {
  return request({
    url: prefix + 'rank/period',
    method: 'get',
    params
  })
}

/**
 * 根据id查询排行书单图书列表
 * periodId	书单id
 * */

export function rankRecord(params) {
  return request({
    url: trad+'book/rank/record/rank',
    method: 'GET',
    params
  })
}

/**
 * 更新图书
 1  id	            记录id	是	[string]		查看
 2	recordId	      图书第三方外键	是	[string]		查看
 3	recommendedSort	排序	是	[string]		查看
 4	bookName	      书名	是	[string]		查看
 5	author	        作者	是	[string]		查看
 6	bookTag	        标签	是	[string]		查看
 7	sourceFrom	    图书来源	是	[string]
 8	summary	        图书摘要	是	[string]		查看
 9	bookCover	      图书封面	是	[string]

 * */

export function rankChange(data) {
  return request({
    url: trad+'book/rank/record/info/change',
    method: 'PUT',
    data
  })
}



/**
 * 上下架图书
 * 1	id	记录id	是	[string]
 * 2	status 0 下架 1 上架
 * */

export function updownShelf(params) {
  return request({
    url: trad+'book/rank/record/upper',
    method: 'PUT',
    params
  })
}
/*******************图书排行 end **************************/


/*******************精选书单 start **************************/
/**
 * 分页查询精选书单  走进名家
 1	currPage	                分页属性：当前页数		[string]
 2	pageSize	                分页属性：每页记录数		[string]
 3	name                    	书单名称		[string]
 4	venueName                 场馆名称		[string]
 5	status	                  发布状态 0 未发布 1 已发布		[string]
 6	examineStatus             审核状态（0-未审核；1-已审核；2-已驳回；3-已发送）		[string]
 7	catalogType	              类型（默认传selectedbooks）	是	[string]

 * */
export function getSelect (params) {
  return request({
    url: trad + 'booklistinfo/list',
    method: 'get',
    params
  })
}

/**
 * POST
 新增精选书单  走进名家
 1	idInstInstitution	            场馆id	是	[string]		查看
 2	name	                        书单名称	是	[string]		查看
 3	booklistType	                书单类型（字典表：1-冬日好书；2-好书推荐；3-精选书单）	是	[string]		查看
 4	catalogType	                  分类（默认传selectedbooks）	是	[string]		查看
 5	venueNum	                    场馆编码	是	[string]		查看
 6	summary                     	简介	是	[string]		查看
 7	detail	                      书单详细信息	是	[string]		查看
 8	coverId	                      书单封面图片id	是	[string]

 * */

export function saveBook(data) {
  return request({
    url: trad+'booklistinfo/save',
    method:'POST',
    data
  })
}


/**
 * 删除书单
 * 1	书单id
 * */

export function deleteBook(data) {
  return request({
    url: trad+'booklistinfo/deleteById',
    method: 'POST',
    data
  })
}


/**
 * 根据id获取书单详情
 * 1	书单主键id
 * */

export function getBookInfo(id) {
  return request({
    url: trad + 'booklistinfo/info/' +id,
    method: 'get',
  })
}


/**
 * POST
 书单信息修改
 1  id	          书单id	是	[string]		查看
 2	name	        书单名称	是	[string]		查看
 3	booklistType	书单分类	是	[string]		查看
 4	summary	      书单简介	是	[string]		查看
 5	detail	      书单详细信息	是	[string]		查看
 6	coverId	      书单封面图片id	是	[string]

 * */

export function updateBook(data) {
  return request({
    url: trad+'booklistinfo/update',
    method:'POST',
    data
  })
}


/**
 * 根据id获取书单图书列表
 * idBookListInformation
 * */

export function getBookListById(params) {
  return request({
    url: trad+'booklistinforecord/bookList',
    method: 'GET',
    params
  })
}


/**
 * 更新图书
 * 1	id	记录id	是	[string]		查看
 2	bookName	书名	是	[string]		查看
 3	author	作者	是	[string]		查看
 4	bookRecommendReason	推荐理由	是	[string]		查看
 5	bookDigest	精彩书摘	是	[string]		查看
 6	recommendedSort	书单推荐排序	是	[string]		查看
 7	bookCover	图书封面	是	[string]
 8	summary	图书摘要	是	[string]		查看
 9	bookTag	图书标签	是	[string]		查看
 10	sourceFrom	来源	是	[string]
 * */

export function bookChange(data) {
  return request({
    url: trad+'booklistinforecord/update',
    method: 'POST',
    data
  })
}


/**
 * 书单新增图书
 1	idBookListInformation	书单id	是	[string]		查看
 2	bookRecommendReason	推荐理由	是	[string]		查看
 3	bookDigest	精彩书摘	是	[string]		查看
 4	recommendedSort	书单推荐排序	是	[string]		查看
 5	bookName	书名	是	[string]		查看
 6	seriesName	从书名	是	[string]		查看
 7	recordId	原始数据第三方键	是	[string]		查看
 8	catalog	目录	是	[string]
 9	translator	编译人	是	[string]
 10	summary	图书摘要	是	[string]		查看
 11	sourceFrom	来源	是	[string]
 12	browseVolume		是	[string]
 13	subject	主题	是	[string]		查看
 14	bookCover	封面图片	是	[string]
 15	author	作者	是	[string]		查看
 16	isbn	isbn	是	[string]		查看
 17	publisher	图书出版社	是	[string]		查看
 18	bookPrice	图书价格	是	[string]
 19	publishDate	图书出版日期	是	[string]		查看
 20	language	语种	是	[string]
 21	bookTag	图书标签	是	[string]
 * */

export function createBook(data) {
  return request({
    url: trad+'booklistinforecord/save',
    method: 'POST',
    data
  })
}




/**
 * 移除此书
 * 1	id	记录id	是	[long]
 * */

export function deleteByBook(data) {
  return request({
    url: trad+'booklistinforecord/delete/'+data.id,
    method: 'POST',
    data
  })
}


/**
 * 发送审核
 * id	主键id	是	[string]
 * */

export function bookSendExamine(data) {
  return request({
    url: trad+'booklistinfo/sendExamine',
    method: 'POST',
    data
  })
}


/**
 * 期次审核
 1  id	                  主键id	        	[long]
 2	examineStatus	        审核状态		      [int]
 3	examineOpinion	      审核意见		      [string]
 * */

export function bookExamine(data) {
  return request({
    url: trad+'booklistinfo/examine',
    method: 'POST',
    data
  })
}



/**
 * 发布/撤销书单
 *1	id	          主键id	是                 	[string]
 2	publishStatus	发布状态 0未发布 1已发布	是	[string]
 * */

export function bookPublish(data) {
  return request({
    url: trad+'booklistinfo/publishById',
    method: 'POST',
    data
  })
}
/*******************精选书单 end **************************/


/*******************走进名家 start **************************/
/*******************走进名家 end **************************/

/*******************图书荐购 start **************************/
/**
 * 分页查询精选书单  走进名家
 1  bookName	            图书名（筛选条件）		[string]
 2	purchaseStatus	      购买状态（筛选条件：0未购买，1已购买）		[string]
 3	venueName	            场馆名称（筛选条件）	是

 * */
export function getBookRecommendRecord (params) {
  return request({
    url: trad + 'bookrecommendrecord/list',
    method: 'get',
    params
  })
}


/**
 * 处理记录
 1  id	                  主键id	        	[long]
 2	examineStatus	        审核状态		      [int]
 3	examineOpinion	      审核意见		      [string]
 * */

export function bookRecordUpdate(data) {
  return request({
    url: trad+'bookrecommendrecord/update',
    method: 'POST',
    data
  })
}


/**
 * 购买状态枚举
 *
 * */

export function getBuyStatus() {
  return request({
    url: trad+'bookrecommendrecord/purchase/status/enum',
    method: 'GET',
  })
}


/*******************图书荐购 end **************************/

/*******************栏目管理 start **************************/

/**
 *
 列表分页查询
 1	limit	分页属性	是	[string]
 2	page	分页属性	是	[string]
 3	publishStatus	发布状态（筛选条件）		[string]
 4	catalogName	栏目名称（筛选条件）		[string]

 * */
export function getMoudle (params) {
  return request({
    url: catalog + 'list',
    method: 'get',
    params
  })
}

/**
 * 新增栏目
 1	idInstInstitution	场馆外键	是	[string]		查看
 2	catalogCode	栏目编码	是	[string]		查看
 3	catalogCoverId	栏目封面id	是	[string]
 4	catalogDetail	栏目详情	是	[string]		查看
 5	catalogName	栏目名称	是	[string]		查看
 6	catalogSummary	栏目简述	是	[string]		查看
 7	catalogType	栏目类型	是	[string]		查看
 8	supportSubscription	是否支持订阅(0：支持；1：不支持)	是	[string]		查看
 9	terminalType	终端类型（1 微信小程序 2 PC），系统参数配置	是	[string]                                   [string]
 * */
export function saveMoudle(data) {
  return request({
    url: catalog+'save',
    method:'POST',
    data
  })
}


/**
 * 修改
 1		id	主键id	是	[string]		查看
 2	idInstInstitution	场馆外键	是	[string]		查看
 3	catalogCode	栏目编码	是	[string]		查看
 4	catalogCoverId	栏目封面id	是	[string]
 5	catalogDetail	栏目详情	是	[string]		查看
 6	catalogName	栏目名称	是	[string]		查看
 7	catalogSummary	栏目简述	是	[string]		查看
 8	catalogType	栏目类型	是	[string]		查看
 9	supportSubscription	是否支持订阅	是	[string]		查看
 10	terminalType	终端类型	是	[string]                              [string]
 * */
export function updateMoudle(data) {
  return request({
    url: catalog+'update',
    method:'POST',
    data
  })
}



/**
 *GET
 * 根据id获取详情
 * 1	书单主键id
 * */

export function getMoudleInfo(id) {
  return request({
    url: catalog + 'info/' +id,
    method: 'get',
  })
}



/**
 * 发布栏目
 id	主键id	是	[string]		查看
 2	status	发布状态（0 未发布 1 已发布）	是	[string]
 * */

export function changeMoudle(data) {
  return request({
    url: catalog+'auditById',
    method: 'PUT',
    data
  })
}




/**
 * 根据id删除
 *1	id	         主键id	     [long]
 * */
export function moudleDelete(data) {
  return request({
    url: catalog+'deleteById',
    method: 'POST',
    data
  })
}



/**
 * 获取订阅枚举类
 *
 * */

export function getSupportStatus() {
  return request({
    url: catalog+'support/status/enum',
    method: 'GET',
  })
}



/*******************栏目管理 end **************************/

/*******************推荐人 start **************************/
export function getTeacherDemeanorData(params) {
  return request({
    url: inheritance+'teacherDemeanor/teacherDemeanorData',
    method: 'GET',
    params
  })
}
/*******************推荐人 end **************************/





