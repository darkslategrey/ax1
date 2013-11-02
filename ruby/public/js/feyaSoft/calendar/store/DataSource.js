/**
 * FeyaSoft MyCalendar
 * Copyright(c) 2006-2012, FeyaSoft Inc. All right reserved.
 * info@cubedrive.com
 * http://www.cubedrive.com
 *
 * Please read license first before your use myCalendar, For more detail
 * information, please can visit our link: http://www.cubedrive.com/myCalendar
 *
 * You need buy one of the Feyasoft's License if you want to use MyCalendar in
 * your commercial product. You must not remove, obscure or interfere with any
 * FeyaSoft copyright, acknowledgment, attribution, trademark, warning or
 * disclaimer statement affixed to, incorporated in or otherwise applied in
 * connection with the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
 * KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY,FITNESS FOR A PARTICULAR PURPOSE
 * AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
Ext.define('Ext.ux.calendar.DataSource', {
	extend : 'Ext.util.Observable',  



    // /* Filter by users */
    // showOnlyUser:function(sucessFn, scope) {
    // 	Ext.Ajax.request({ 
    // 	    url: Ext.ux.calendar.CONST.showOnlyUserEventURL,
    // 	    params: {
    // 		user_id: combo.value,
    // 		combo_name: combo.hiddenName
    // 	    },
    // 	    success: function(response, options) {
    // 		var backObj = Ext.decode(response.responseText);
    // 		sucessFn.call(this, backObj);
    // 	    },
    // 	    failure: function(response, options) {

    // 	    },
    // 	    scope: this
    // 	});
    // },

    showOnlyUsers: function(useraskedValue, usertodoValue, sucessFn, scope) {

	console.log("DataSource.showOnlyUsers: useraskedValue <"+useraskedValue+">");
	console.log("DataSource.showOnlyUsers: usertodoValue <"+usertodoValue+">");

	Ext.usertodo = usertodoValue;

	Ext.Ajax.request({ 
	    url: Ext.ux.calendar.CONST.showOnlyUserEventURL,
	    params: {
		userasked: new String(useraskedValue), 
		usertodo: new String(usertodoValue)
	    },
	    success: function(response, options) {
		var backObj = Ext.decode(response.responseText);
		if(backObj.success == 'false') {
//		    console.log("Error while getting specific user's events");
		} else {
//		    console.log("Success while getting specific user's events");

		    sucessFn.call(scope, backObj);
		}
	    },
	    failure: function(response, options) {
	    },
	    scope: scope || this
	});
    },
    /*
     * For show all calendars
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function
     */
    showAllCalendar:function(sucessFn, scope){
        Ext.Ajax.request({
            url:Ext.ux.calendar.CONST.showAllCalendarURL,
            params:{
                userId:this.mainPanel.userId
            },
            success:function(response, options){
                /*
                 * The back json string should have a param "success", when it equal "false" means fail to create/update in server side
                 */
                var backObj = Ext.decode(response.responseText);
                if (backObj.success == 'false') {
                    Ext.Msg.show({
                        title:'Error',
                        msg: backObj.errorInfo,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                } else {
                    sucessFn.call(scope, backObj);
                }
            },
            failure:function(response, options){

            },
            scope:scope || this
        });
    },
    /*
     * For hide all calendars but only show this one
     * @param {int} calendarId: the id of the calendar
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function
     */
    showOnlyCalendar:function(calendarId, sucessFn, scope){
	var user_asked_ele = Ext.query('input[name=userasked]')[0]
	var user_todo_ele = Ext.query('input[name=usertodo]')[0]
	var user_done_ele = Ext.query('input[name=userdone]')[0]

	var userasked = user_asked_ele == null ? '' : user_asked_ele.value
	var usertodo = user_todo_ele == null ? '' : user_todo_ele.value
	var userdone = user_done_ele == null ? '' : user_done_ele.value

	console.log("user_todo_ele %" + user_todo_ele + "%");
        Ext.Ajax.request({
            url:Ext.ux.calendar.CONST.showOnlyCalendarURL,
            params:{
                id:calendarId,
		userasked: userasked,
		usertodo: usertodo,
		userdone: userdone
            },
            success:function(response, options){
                /*
                 * The back json string should have a param "success", when it equal "false" means fail to create/update in server side
                 */
                var backObj = Ext.decode(response.responseText);
                if (backObj.success == 'false') {
                    Ext.Msg.show({
                        title:'Error',
                        msg: backObj.errorInfo,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                } else {
                    sucessFn.call(scope, backObj);
                }
            },
            failure:function(response, options){

            },
            scope:scope || this
        });
    },
    /*
     * For create/update a calendar
     * @param {Obj} calendar: the object of a calendar, should contain all field of calendar table in db
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function     
     */
    createUpdateCalendar:function(calendar, sucessFn, scope){
        Ext.Ajax.request({
            url:Ext.ux.calendar.CONST.createUpdateCalendarURL,
            /* The params pass to db contains below fields:
             * id: int, the id of calendar, primary key
             * name: string, the name of calendar
             * description: string, the description of calendar
             * color: string, the color of calendar, it's a string, should be one of ["blue", "red", "cyan", "orange", "green", "purple"],
             *    see colorIndex in common/Mask.js for detail, if you want to add more color, you need add it in colorIndex array and colors array in Mask.js,
             *    and also you need add related css in css/calendar.css
             * hide: boolean, the status of calendar, true for hide, false for show
             */
            params:{
                id:calendar.id,
                name:calendar.name,
                description:calendar.description,
                color:calendar.color,
                hide:calendar.hide,
                userId:this.mainPanel.userId
            },
            success:function(response, options){
                /*
                 * The back json string should have a param "success", when it equal "false" means fail to create/update in server side
                 */
                var backObj = Ext.decode(response.responseText);
		//alert("success " + backObj.success);
                if (backObj.success == 'false') {
                    Ext.Msg.show({
                        title:'Error',
                        msg: backObj.errorInfo,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                } else {
		    Ext.create('widget.uxNotification', {
			position: 'r',
			useXAxis: true,
			cls: 'ux-notification-light',
			iconCls: 'ux-notification-icon-information',
			closable: false,
			title: '',
			html: 'Action réussie',
			slideInDuration: 800,
			slideBackDuration: 1000,
			autoCloseDelay: 2000,
			slideInAnimation: 'elasticIn',
			slideBackAnimation: 'elasticIn'
		    }).show();
                    sucessFn.call(scope, backObj);
                }
            },
            failure:function(response, options){
                var backObj = Ext.decode(response.responseText);
                    Ext.Msg.show({
                        title:'Error',
                        msg: backObj.errorInfo,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
            },
            scope:scope || this
        });
    },
    /*
     * For delete all events belong to a calendar
     * @param {int} calendarId: the id of a calendar
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function
     */
    deleteEventsByCalendar:function(calendarId, sucessFn, scope){
        Ext.Ajax.request({
            url:Ext.ux.calendar.CONST.deleteEventsByCalendarURL,
            /*
             * pass the calendarId
             */
            params:{
                calendarId:calendarId
            },
            success:function(response, options){
                /*
                 * The back json string should have a param "success", when it equal "false" means fail to create/update in server side
                 */
                 var backObj = Ext.decode(response.responseText);
                if (backObj.success == 'false') {
                    Ext.Msg.show({
                        title:'Error',
                        msg: backObj.errorInfo,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                } else {
                    sucessFn.call(scope, backObj);
                }
            },
            failure:function(response, options){

            },
            scope:scope || this
        });
    },
    /*
     * For delete a calendar and all events belong to it
     * @param {int} calendarId: the id of a calendar
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function
     */
    deleteCalendar:function(calendarId, sucessFn, scope){
        Ext.Ajax.request({
            url:Ext.ux.calendar.CONST.deleteCalendarURL,
            /*
             * pass the calendarId
             */
            params:{
                id:calendarId
            },
            success:function(response, options){
                /*
                 * The back json string should have a param "success", when it equal "false" means fail to create/update in server side
                 */
                 var backObj = Ext.decode(response.responseText);
                if (backObj.success == 'false') {
                    Ext.Msg.show({
                        title:'Error',
                        msg: backObj.errorInfo,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                } else {
                    sucessFn.call(scope, backObj);
                }
            },
            failure:function(response, options){

            },
            scope:scope || this
        });
    },
    /*
     * For load all calendars of a user
     * @param {int} userId: the id of a user
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function
     */
    loadCalendar:function(successFn, scope){
        Ext.Ajax.request({
           url:Ext.ux.calendar.CONST.loadCalendarURL,
            params:{
                userId:this.mainPanel.userId
            },
            success:function(response, options){
                /*
                 * The back json string should like below:
                 * {    
                 *      "total":2,
                 *      "results":[{
                 *              "id":"1",
                 *              "color":"blue",
                 *              "description":null,
                 *              "hide":false,
                 *              "name":"Demo"
                 *       },{
                 *              "id":"2",
                 *              "color":"red",
                 *              "description":null,
                 *              "hide":false,
                 *              "name":"df"
                 *       }]
                 * }
                 */               
		alert("into load cal datastore"); 
                var backObj = Ext.decode(response.responseText);
                if (backObj.success == 'false') {
                    Ext.Msg.show({
                        title:'Error',
                        msg: backObj.errorInfo,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                } else {
                    successFn.call(scope, backObj);
                }
            },
            failure:function(response, options){

            },
            scope:scope || this
        });
    },
    /*
     * For load all events from a day to another day
     * @param {Date} startData: the start date
     * @param {Date} endData: the end date
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function     
     */
    loadEvent:function(startDate, endDate, usertodo, sucessFn, scope){
	// console.log("PASSAGE !!! ");
	if(usertodo == undefined) {
	    usertodo = Ext.usertodoValues;
	}
	// console.log("usertodo <"+usertodo+">");
	// console.log("Ext.usertodoValues <"+Ext.usertodoValues+">");
        startDate = startDate || new Date();
        endDate = endDate || new Date();
        var startDay =  Ext.Date.format(startDate,'Y-m-d');
        var endDay =  Ext.Date.format(endDate,'Y-m-d');

	if(Ext.usertodoValues == undefined) {
	    Ext.usertodoValues = [];
	}

        Ext.Ajax.request({
            url:Ext.ux.calendar.CONST.loadEventURL,
            /*
             * the params pass to server should contain:
             * startDay: the start Date, we just use 'Y-m-d' format here, you can change it as you like
             * endDay: the end Date, we just use 'Y-m-d' format here, you can change it as you like
             */
	    // url: Ext.ux.calendar.CONST.showOnlyUserEventURL,
	    params: {
		userasked: new String(Ext.useraskedValue), 
		usertodo: Ext.usertodoValues.join(','),
                startDay:startDay,
                endDay:endDay,
                userId:this.mainPanel.userId,
		usertodoValues: Ext.usertodoValues.join(',')
	    },

            // params:{
            //     startDay:startDay,
            //     endDay:endDay,
            //     userId:this.mainPanel.userId,
	    // 	usertodoValues: new String(usertodo)
            // },
            success:function(response, options){
                var backObj = Ext.decode(response.responseText);
                /*
                 * The back json string should like below:
                 * {
                 *      "total":1,
                 *      "results":[{
                 *              "id":"1",
                 *              "calendarId":0,
                 *              "color":"blue", // string; this color should be the same as the color of calendar "0"
                 *              "startRow":0, // int; startRow is in [0, 47], for 00:00-23:30
                 *              "endRow":2, //int; endRow is in [1, 48], for 00:30-24:00
                 *              "subject":"lunch", //string; the subject of this event
                 *              "description":"in hilton hotel", //string; the description of this event
                 *              "day":"2009-8-11", //string; the date of this event, need be 'Y-m-d' format
                 *              "alertFlag":[], //array; contain the alert information, in old version, it's just a boolean
                 *              "locked":false //boolean; true means this event is a locked event, nobody can change it, not use yet, in this version it should always be false
                 *       }]
                 * }
                 */
                if (backObj.success == 'false') {
                    Ext.Msg.show({
                        title:'Error',
                        msg: backObj.errorInfo,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                } else {
                    var rs = backObj['results'];
                    var eventSet = {};
                    eventSet['whole'] = [];
                    var getRowFromHM = Ext.ux.calendar.Mask.getRowFromHM;
		    var whole_hour = 9;
		    var current_day = '';
		    var quaters = 1;
		    var minute_start = 0;
		    var minute_end = 0;
		    var hour_start = 0, hour_end = 0;
                    for(var i = 0, len = rs.length; i < len; i++){

                        var data = rs[i];
			// console.log("data.startTime <"+data.startTime+"> interval <"+this.intervalSlot+">");
                        var startRow = getRowFromHM(data.startTime, this.intervalSlot);
			// console.log("data.startTime <"+data.startTime+"> interval <"+this.intervalSlot+">");
			// console.log("startRow <"+startRow+">");
                        var endRow = getRowFromHM(data.endTime, this.intervalSlot);
                        if(endRow == startRow){
                            endRow++;
                        }
                        var day = data.ymd;
                        var eday = data.eymd;
			if(current_day == '') { current_day = day; }
                        //alert(this.activeStartRow+':'+this.activeEndRow+':'+this.hideInactiveRow+':'+startRow+':'+endRow+':'+data.subject)
                        if(!this.hideInactiveRow 
                            || (this.activeStartRow <= startRow && endRow <= this.activeEndRow)
                                || (0 == startRow && this.rowCount == endRow) || (day != eday)){
                            
                            eventSet[day] = eventSet[day] || [];                            

//			    console.log("finished : <"+data.finished+"> event id <" + data.id + ">");
                            var e = {
                                eventId:data.id,
                                calendarId:data.calendarId,
                                color:data.color,
                                startRow:startRow,
                                endRow:endRow,
                                subject:data.subject,
				usertodo: data.usertodo,
				userasked: data.userasked,
                                content:data.description,
				finished: data.finished,
                                day:day,
				contact: data.contact,
				societe: data.societe,
                                eday:eday,
				fulldayevent: data.fulldayevent,
                                alertFlag:Ext.decode(data.alertFlag),
				uploads: data.uploads,
                                locked:data.locked,
                                repeatType: data.repeatType == 'no' ? 'no' : Ext.decode(data.repeatType),
				tlj: false
                            };

                            if(day != eday || (0 == startRow) && (this.rowCount == endRow)){
				if(e.calendarId == 1 || e.calendarId == 2) {


                                    if(current_day != day) { 
					var d = new Date(day);
					start_date  = new Date(d.getFullYear(), d.getMonth()+1, d.getDay(), 9, 00);
					// start_date  = new Date(day + 'T09:00')
					// console.log("%%%%%%%%% INIT date <"+start_date+">");
					end_date    = new Ext.Date.add(start_date, Ext.Date.MINUTE, 15);
					current_day = day; 
				    } else {
					start_date = end_date
					end_date   = new Ext.Date.add(start_date, Ext.Date.MINUTE, 15);
				    }

				    hour_start   = start_date.getHours();
				    minute_start = start_date.getMinutes();

				    hour_end   = end_date.getHours();
				    minute_end = end_date.getMinutes();

				    // console.log("========= hour_start <"+hour_start+":"+minute_start+"> hour_end <"+hour_end+":"+minute_end+">======");
				    // console.log("day: <"+day+">");				    
				    // console.log("startTime <"+data.startTime+">");
				    // console.log("endTime <"+data.endTime+">");
				    
				    hour_start_s   = hour_start < 10 ? "0"+hour_start : hour_start;
				    hour_end_s     = hour_end < 10 ? "0"+hour_end : hour_end;
				    minute_start_s = minute_start < 10 ? "0"+minute_start : minute_start;
				    minute_end_s   = minute_end < 10 ? "0"+minute_end : minute_end;

				    // console.log("hour_start <"+hour_start_s+":"+minute_start_s+"> hour_end <"+hour_end_s+":"+minute_end_s+">");

				    e.startRow = getRowFromHM(hour_start_s+":"+minute_start_s, this.intervalSlot);
				    e.endRow   = getRowFromHM(hour_end_s+":"+minute_end_s, this.intervalSlot);

                                    eventSet[day] = eventSet[day] || [];
                                    eventSet[day].push(e);

				    // console.log("loadEvent : <" + e.subject + ">");
				    e.tlj = true; // toute la journée
				} else { // seulement les régies ici
                                    eventSet['whole'].push(e);
				}
                            }else{
                                eventSet[day] = eventSet[day] || [];
                                eventSet[day].push(e);
                            }
                        }
                    }
                    sucessFn.call(scope, eventSet);
                }
            },
            failure:function(response, options){

            },
            scope:scope || this
        });
    },

    loadRepeatEvent:function(sucessFn, scope){
        Ext.Ajax.request({
            url:Ext.ux.calendar.CONST.loadRepeatEventURL,
            params:{
                userId:this.mainPanel.userId
            },
            success:function(response, options){
                var backObj = Ext.decode(response.responseText);
                if (backObj.success == 'false') {
                    Ext.Msg.show({
                        title:'Error',
                        msg: backObj.errorInfo,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }else{
                    var rs = backObj['results'];
                    var eventSet = {};
                    var getRowFromHM = Ext.ux.calendar.Mask.getRowFromHM;
                    for(var i = 0, len = rs.length; i < len; i++){
                        var data = rs[i];
                        var startRow = getRowFromHM(data.startTime, this.intervalSlot);
                        var endRow = getRowFromHM(data.endTime, this.intervalSlot);
                        if(startRow == endRow){
                            endRow++;
                        }   
                        var day = data.ymd;
                        var eday = data.eymd;
                        //alert(this.activeStartRow+':'+this.activeEndRow+':'+this.hideInactiveRow+':'+startRow+':'+endRow+':'+data.subject)
                        if(!this.hideInactiveRow 
                            || (this.activeStartRow <= startRow && endRow <= this.activeEndRow)
                                || (0 == startRow && this.rowCount == endRow) || (day != eday)){
	                        var e = {
	                            eventId:data.id,
	                            calendarId:data.calendarId,
	                            color:data.color,
	                            startRow:startRow,
	                            endRow:endRow,
	                            subject:data.subject,
	                            content:data.description,
				    usertodo:data.usertodo,
	                            repeatType:Ext.decode(data.repeatType),                            
	                            alertFlag:Ext.decode(data.alertFlag),
	                            locked:data.locked
	                        };                        
	                        eventSet[e.eventId] = e;
                        }
                    }
                    sucessFn.call(scope, eventSet);
                }
            },
            failure:function(response, options){

            },
            scope:scope || this
        });
    },
    /*
     * For create an event
     * @param {Obj} event: the object of event
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function
     */
    createEvent:function(event, uploadFilePanel, calendarId, sucessFn, scope){
        var day = event.day || Ext.Date.format((new Date()),'Y-m-d');
        var eday = event.eday || day; 
	var allday = false;
	if(event.calendarId == 3 || event.calendarId == 4) {
	    allday = true;
	}
	event.tlj = event.fulldayevent == 1 ? true : false;

        Ext.Ajax.request({
            url:Ext.ux.calendar.CONST.createEventURL,
            /*
             * the params pass to server should contain:
             * calendarId: int, the id of the calendar this event belong to
             * selectedDay: string, 'Y-m-d' format, the day of this event
             * startHMTime: string, 'H:i' format, the start time of this event
             * endHMTime: string, 'H:i' format, the end time of this event
             * repeatType: boolean, not use yet, always false in this version
             * allDay: boolean, if true means this event is a whole event
             * flag: boolean, if true mean this event need alert a window when it's activing
             * locked: boolean, if true mean this event is locked, can not be changed
             * subject: string, the subject of this event
             * description: string, the description of this event
             */
            params:{
                'calendarId':event.calendarId,
                'startDay':day,
                'endDay':eday,
                'startHMTime':Ext.ux.calendar.Mask.getIntervalFromRow(this.intervalSlot, event.startRow),
                'endHMTime':Ext.ux.calendar.Mask.getIntervalFromRow(this.intervalSlot, event.endRow),
                // 'repeatType':event.repeatType,
		'repeatType': ('string' == Ext.ux.calendar.Mask.typeOf(event.repeatType))?event.repeatType:Ext.encode(event.repeatType),                  
                'alertFlag':Ext.encode(event.alertFlag),
                'locked':event.locked,
                'subject':event.subject,
                'description':event.content,
		'allday': allday,
		'usertodo': event.usertodo,
		'userdone': event.userdone,
		'finished': event.finished,
		// 'uploadfile': event.uploadfile,
                'userId':this.mainPanel.userId
            },
            success:function(response, options){
                 var backObj = Ext.decode(response.responseText);
                /*
                 * The back json string should contain a param "id", which is the id of the event just created,
                 * it should also have a param "success", when it equal "false" means fail to create/update in server side,
                 * for example: {"success":"true","info":"Your have successful created event","id":17}
                 */
                if (backObj.success == false) {
                    Ext.Msg.show({
                        title:'Error',
                        msg: backObj.errorInfo,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                } else {
		    Ext.create('widget.uxNotification', {
			position: 'r',
			useXAxis: true,
			cls: 'ux-notification-light',
			iconCls: 'ux-notification-icon-information',
			closable: false,
			title: 'Infos',
			html: 'Création réussie ('+backObj.eventId+')',
			slideInDuration: 800,
			slideBackDuration: 500,
			autoCloseDelay: 1000,
			slideInAnimation: 'elasticIn',
			slideBackAnimation: 'elasticIn'
		    }).show();
                    sucessFn.call(scope, backObj);
                }
            },
            failure:function(response, options){

            },
	    callback: function(opt, sucess, response) {
		if(uploadFilePanel == undefined) {
		    return true;
		}
                backObj = Ext.decode(response.responseText);
	form = uploadFilePanel.getForm();
//	    console.log("apres createion de event <"+backObj.eventId+">");
//		console.log("filename <"+uploadFilePanel.getChildByElement("uploadFileField").getValue()+">");
		if(form.isValid() && uploadFilePanel.getChildByElement("uploadFileField").getValue() != ""){
	    form.submit({
		params: { event_id: backObj.eventId, cal_id2: calendarId },
		url: Ext.ux.calendar.CONST.uploadFileURL,
		waitMsg: 'Transmission du fichier ...',
		success: function(form, action) {

		    if(action.result.success == false) {
			Ext.Msg.show({
			    title:'Error',
			    msg: action.result.errorInfo,
			    buttons: Ext.Msg.OK,
			    icon: Ext.MessageBox.ERROR
			});
		    } else {
			Ext.create('widget.uxNotification', {
			    position: 'r',
			    useXAxis: true,
			    cls: 'ux-notification-light',
			    iconCls: 'ux-notification-icon-information',
			    closable: false,
			    title: 'Bonne nouvelle',
			    html: 'Fichier transmis!',
			    slideInDuration: 800,
			    slideBackDuration: 500,
			    autoCloseDelay: 1000,
			    slideInAnimation: 'elasticIn',
			    slideBackAnimation: 'elasticIn'
			}).show();
		    }
//		    console.log("filename " + action.result.filename);
		    // uploadedFileList = uploadFilePanel.queryById('uploadedFileList');
		    // uploadedFileList.text = action.result.filename;
		},
		failure: function(form, action) {
		    Ext.Msg.show({
                        title:'Error',
                        msg: action.result.errorInfo,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
		    });
		}
	    });
	}

	    }
        });
    },
    /*
     * For update an event
     * @param {Obj} event: the object of event
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function
     */
    updateEvent:function(event, sucessFn, scope){
        var day = event.day || Ext.Date.format(new Date(),'Y-m-d');
        var eday = event.eday || day;        
	var startTime = Ext.ux.calendar.Mask.getIntervalFromRow(this.intervalSlot, event.startRow);
	var endTime = Ext.ux.calendar.Mask.getIntervalFromRow(this.intervalSlot, event.endRow);
	if(event.fulldayevent == 1) {
	    startTime = "00:00:00";
	    endTime   = "23:59:00";
	}
        Ext.Ajax.request({
            url:Ext.ux.calendar.CONST.updateEventURL,

		
            /*
             * the params pass to server should contain:
             * id: int, the id of the event
             * calendarId: int, the id of the calendar this event belong to
             * selectedDay: string, 'Y-m-d' format, the day of this event
             * startHMTime: string, 'H:i' format, the start time of this event
             * endHMTime: string, 'H:i' format, the end time of this event
             * repeatType: boolean, not use yet, always false in this version
             * allDay: boolean, if true means this event is a whole event
             * alertFlag:[], //array; contain the alert information, in old version, it's just a boolean
             * locked: boolean, if true mean this event is locked, can not be changed
             * subject: string, the subject of this event
             * description: string, the description of this event
             */
            params:{
                'id':event.eventId,
                'calendarId':event.calendarId,
                'startDay':day,
                'endDay':eday,
                'startHMTime':startTime,
                'endHMTime':endTime,
		'repeatType': ('string' == Ext.ux.calendar.Mask.typeOf(event.repeatType))?event.repeatType:Ext.encode(event.repeatType),                  
                // 'repeatType':event.repeatType,                
                'alertFlag':Ext.encode(event.alertFlag),
                'locked':event.locked,                
                'subject':event.subject,
                'description':event.content,
		'usertodo': event.usertodo,
		'userauthor': event.userauthor,
		'finished': event.finished,
		'userdone': event.userdone,
		'fulldayevent': event.fulldayevent
            },
            success:function(response, options){
                 var backObj = Ext.decode(response.responseText);
                /*
                 * The back json string should have a param "success", when it equal "false" means fail to create/update in server side
                 */
                if (backObj.success == false) {
                    Ext.Msg.show({
                        title:'Error',
                        msg: backObj.errorInfo,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                } else {
		    Ext.create('widget.uxNotification', {
			position: 'r',
			useXAxis: true,
			cls: 'ux-notification-light',
			iconCls: 'ux-notification-icon-information',
			closable: false,
			title: 'Info!',
			html: 'Maj réussie',
			slideInDuration: 800,
			slideBackDuration: 500,
			autoCloseDelay: 100,
			slideInAnimation: 'elasticIn',
			slideBackAnimation: 'elasticIn'
		    }).show();

                    sucessFn.call(scope, backObj);
                }
            },
            failure:function(response, options){

            },
            scope:scope || this
        });
    },
    /*
     * For delete an event
     * @param {Obj} event: the object of event
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function
     */
    deleteEvent:function(event, sucessFn, scope){
//	console.log("event calendar id <"+event.calendarId+">");
        Ext.Ajax.request({
            url:Ext.ux.calendar.CONST.deleteEventURL,
            /*
             * pass the id of event to delete
             */
            params:{
                'id':event.eventId,
		'cal_id': event.calendarId
            },
            success:function(response, options){
                 var backObj = Ext.decode(response.responseText);
                /*
                 * The back json string should have a param "success", when it equal "false" means fail to delete in server side
                 */
                if (backObj.success == 'false') {
                    Ext.Msg.show({
                        title:'Error',
                        msg: backObj.errorInfo,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                } else {
		    Ext.create('widget.uxNotification', {
			position: 'r',
			useXAxis: true,
			cls: 'ux-notification-light',
			iconCls: 'ux-notification-icon-information',
			closable: false,
			title: '',
			html: 'Suppression réussie',
			slideInDuration: 800,
			slideBackDuration: 1000,
			autoCloseDelay: 2000,
			slideInAnimation: 'elasticIn',
			slideBackAnimation: 'elasticIn'
		    }).show();
                    sucessFn.call(scope, backObj);
                }
            },
            failure:function(response, options){

            },
            scope:scope || this
        });
    },

    deleteRepeatEvent:function(event, makeException, sucessFn, scope){
        Ext.Ajax.request({
            url:Ext.ux.calendar.CONST.deleteRepeatEventURL,
            /*
             * pass the id of event to delete
             */
            params:{
                'id':event.eventId,
                'makeException':makeException,
                'repeatType':Ext.encode(event.repeatType)
            },
            success:function(response, options){
                 var backObj = Ext.decode(response.responseText);
                /*
                 * The back json string should have a param "success", when it equal "false" means fail to delete in server side
                 */
                if (backObj.success == 'false') {
                    Ext.Msg.show({
                        title:'Error',
                        msg: backObj.errorInfo,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                } else {
                    sucessFn.call(scope, backObj);
                }
            },
            failure:function(response, options){

            },
            scope:scope || this
        });
    },
    /*
     * For change all events in a day to another day
     * @param {string} oday: the old day, all events belong to this day need be changed
     * @param {string} nday: the new day, all events belong to old day will change to this day
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function
     * @param {boolean} keep: if true will keep the events for old day, if false then delete events for old day
     */
    changeDay:function(oday, nday, sucessFn, scope, keep){
        Ext.Ajax.request({
            url:Ext.ux.calendar.CONST.changeDayURL,
            params:{
                'dragDay':oday,
                'dropDay':nday,
                'keep':keep
            },
            success:function(response, options){
                var backObj = Ext.decode(response.responseText);
                /*
                 * If keep is true, the back json string should contain a param "ids", which is an array keeps the id of the events just created for new day,
                 * for example: {"success":"true","info":"You have success update those events","backids":[18,19]};
                 * if keep is false, the back json is like: {"success":"true","info":"You have success update those events","backids":[]};
                 * it should also have a param "success", when it equal "false" means fail to change in server side
                 */
                if (backObj.success == 'false') {
                    Ext.Msg.show({
                        title:'Error',
                        msg: backObj.errorInfo,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                } else {
                    sucessFn.call(scope, backObj);
                }
            },
            failure:function(response, options){

            },
            scope:scope || this
        });
    },
    /*
     * For delete all events in a day
     * @param {string} day: all events belong to this day need be deleted
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function
     */
    deleteDay:function(day, sucessFn, scope){
        Ext.Ajax.request({
            url:Ext.ux.calendar.CONST.deleteDayURL,
            /*
             * pass the day to server, it's a string, 'Y-m-d' format
             */
            params:{
                'day':day
            },
            success:function(response, options){
                 var backObj = Ext.decode(response.responseText);
                 /*
                  * The back json string should have a param "success", when it equal "false" means fail to delete in server side
                  */
                if (backObj.success == 'false') {
                    Ext.Msg.show({
                        title:'Error',
                        msg: backObj.errorInfo,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                } else {
                    sucessFn.call(scope, backObj);
                }
            },
            failure:function(response, options){

            },
            scope:scope || this
        });
    },
    /*
     * For load setting of feyaCalendar   
     * @param {int} userId: the ID of current user
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function  
     */
    loadSetting:function(userId, sucessFn, scope){
    	Ext.Ajax.request({
            url:Ext.ux.calendar.CONST.loadSettingURL,
            /*
             * pass the userId to server
             */
            params:{
                'userId':userId
            },
            success:function(response, options){
                 var backObj = Ext.decode(response.responseText);
                 /*
                  * The back json string should have a param "success", when it equal "false" means fail to delete in server side
                  */
                if (backObj.success == 'false') {
                    Ext.Msg.show({
                        title:'Error',
                        msg: backObj.errorInfo,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                } else {
                    sucessFn.call(scope, backObj);
                }
            },
            failure:function(response, options){

            },
            scope:scope || this
        });
    },
    /*
     * For save setting of feyaCalendar   
     * @param {obj} obj: the obj of current setting
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function  
     */
    updateSetting:function(obj, sucessFn, scope){
        var params = {
            'userId':this.mainPanel.userId
        };
        Ext.apply(params, obj);
    	Ext.Ajax.request({
            url:Ext.ux.calendar.CONST.updateSettingURL,
            /*
             * pass the userId to server
             */
            params:params,
            success:function(response, options){
                 var backObj = Ext.decode(response.responseText);
                 /*
                  * The back json string should have a param "success", when it equal "false" means fail to delete in server side
                  */
                if (backObj.success == 'false') {
                    Ext.Msg.show({
                        title:'Error',
                        msg: backObj.errorInfo,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                } else {
                    sucessFn.call(scope, backObj);
                }
            },
            failure:function(response, options){

            },
            scope:scope || this
        });
    },

    createUpdateRepeatEvent:function(event, oevent, sucessFn, scope){
        var stime = Ext.ux.calendar.Mask.getIntervalFromRow(this.intervalSlot, event.startRow);
        var etime = Ext.ux.calendar.Mask.getIntervalFromRow(this.intervalSlot, event.endRow);        
        var params = {
            'calendarId':event.calendarId,
            'startDay':event.day,
            'endDay':event.eday,
            'startHMTime':stime,
            'endHMTime':etime,
            'repeatType': ('string' == Ext.ux.calendar.Mask.typeOf(event.repeatType))?event.repeatType:Ext.encode(event.repeatType),                  
            'alertFlag':Ext.encode(event.alertFlag),
            'locked':event.locked,
            'subject':event.subject,
	    'usertodo':event.usertodo,
            'description':event.content,
            'userId':this.mainPanel.userId
        };        
        if('prepare' != event.eventId){
            params.id = event.eventId;
        }
        if(oevent){
            if('string' == Ext.ux.calendar.Mask.typeOf(oevent.repeatType)){
                params.oldRepeatType = oevent.repeatType;
            }else{
                params.oldRepeatType = Ext.encode(oevent.repeatType);                
            }
        }
        Ext.Ajax.request({
            url:Ext.ux.calendar.CONST.createUpdateRepeatEventURL,
            /*
             * the params pass to server should contain:
             * calendarId: int, the id of the calendar this event belong to
             * selectedDay: string, 'Y-m-d' format, the day of this event
             * startHMTime: string, 'H:i' format, the start time of this event
             * endHMTime: string, 'H:i' format, the end time of this event
             * repeatType: boolean, not use yet, always false in this version
             * allDay: boolean, if true means this event is a whole event
             * flag: boolean, if true mean this event need alert a window when it's activing
             * locked: boolean, if true mean this event is locked, can not be changed
             * subject: string, the subject of this event
             * description: string, the description of this event
             */
            params:params,
            success:function(response, options){
                 var backObj = Ext.decode(response.responseText);
                /*
                 * The back json string should contain a param "id", which is the id of the event just created,
                 * it should also have a param "success", when it equal "false" means fail to create/update in server side,
                 * for example: {"success":"true","info":"Your have successful created event","id":17}
                 */
                if (backObj.success == 'false') {
                    Ext.Msg.show({
                        title:'Error',
                        msg: backObj.errorInfo,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                } else {                    
		    Ext.create('widget.uxNotification', {
			position: 'r',
			useXAxis: true,
			cls: 'ux-notification-light',
			iconCls: 'ux-notification-icon-information',
			closable: false,
			title: 'Information',
			html: 'Mise à jour réussie',
			slideInDuration: 800,
			slideBackDuration: 1000,
			autoCloseDelay: 2000,
			slideInAnimation: 'elasticIn',
			slideBackAnimation: 'elasticIn'
		    }).show();
                    sucessFn.call(scope, backObj);
                }
            },
            failure:function(response, options){

            }
        });
    },
    /*
     * For load setting and calendar from db
     * @param {int} userId: the ID of current user
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function
     */
    initialLoad:function(userId, sucessFn, scope){
	// alert(Ext.ux.calendar.CONST.initialLoadURL + " POST METHOD");
    	Ext.Ajax.request({
            url:Ext.ux.calendar.CONST.initialLoadURL,
	    method: 'POST',
            /*
             * pass the userId to server
             */
            params:{
                'userId':userId
            },
            success:function(response, options){            	
		// alert("success");
		// alert(response.responseText);
                 var backObj = Ext.decode(response.responseText);
                 
                 /*
                  * The back json string should have a param "success", when it equal "false" means fail to delete in server side
                  */
                if (backObj.success == 'false') {
                    Ext.Msg.show({
                        title:'Error',
                        msg: backObj.errorInfo,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                } else {
                    var cs = backObj.cs[0];                                       
                    cs = Ext.ux.calendar.Mask.calculateActiveRow(cs);
                    Ext.apply(this, cs);
                    backObj.cs = cs;                    
                    var re = backObj.re;
                    var eventSet = {};
                    var getRowFromHM = Ext.ux.calendar.Mask.getRowFromHM;
                    for(var i = 0, len = re.length; i < len; i++){
                        var data = re[i];
                        var startRow = getRowFromHM(data.startTime, this.intervalSlot);
                        var endRow = getRowFromHM(data.endTime, this.intervalSlot);
                        if(startRow == endRow){
                            endRow++;
                        }    
                        var day = data.ymd;
                        var eday = data.eymd;
                        
                        if(!this.hideInactiveRow 
                            || (this.activeStartRow <= startRow && endRow <= this.activeEndRow)
                                || (0 == startRow && this.rowCount == endRow) || (day != eday)){
	                        var e = {
	                            eventId:data.id,
	                            calendarId:data.calendarId,
	                            color:data.color,
	                            startRow:startRow,
	                            endRow:endRow,
				    usertodo: data.usertodo,
	                            subject:data.subject,
	                            content:data.description,
	                            repeatType:Ext.decode(data.repeatType),
	                            alertFlag:Ext.decode(data.alertFlag),
	                            locked:data.locked
	                        };
	                        eventSet[e.eventId] = e;
                        }
                    }
                    backObj.re = eventSet;
                    sucessFn.call(scope, backObj);
                }
            },
            failure:function(response, options){

            },
            scope:scope || this
        });
    }
});