/**
 * FeyaSoft MyCalendar Copyright(c) 2006-2012, FeyaSoft Inc. All right reserved.
 * info@cubedrive.com http://www.cubedrive.com
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
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY,FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
 * EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES
 * OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
Ext.define('User', {
    extend: 'Ext.data.Model',
    fields: [
	{ name: 'completename', type: 'string' },
	{ name: 'firstname', type: 'string' },
	{ name: 'name',      type: 'string' },
	{ name: 'rowid',     type: 'string' }
    ]
});

var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {});

var calUsers = Ext.create('Ext.data.Store', {
    model: 'User',
    proxy: {
	type: 'ajax',
	url: document.URL + '/users',
	reader: {
	    type: 'json',
	    root: 'users',
	    successProperty: 'success'
	}
    },
    autoLoad: true
});



Ext.define('Ext.ux.calendar.editor.DetailEditor', {
    
    extend : 'Ext.ux.calendar.view.BasicView',
    
    initComponent : function() {
	this.ehandler.applyCalendarSetting(this);
	var lan = Ext.ux.calendar.Mask.Editor;

	//this.addEvents('uploadFile');
	//this.on('uploadFile', this.onUploadFileSubmitFn, this);

	this.usertodoLabel = this.usertodoLabel || Ext.create('Ext.form.Label', {text: 'Affectés à' });
	this.usertodoCombo = this.usertodoCombo || Ext.create('Ext.form.ComboBox', {
	    hiddenName: 'usertodo',
	    fieldLabel: '',
	    editable: false,
	    store: calUsers,
	    width: 300,
	    queryMode: 'local',
	    displayField: 'completename',
	    valueField: 'rowid',
	    renderTo: Ext.getBody()
	});
	this.userdoneLabel = this.userdoneLabel || Ext.create('Ext.form.Label', 
							      { text: 'Réalisés par' });
	this.userdoneCombo = this.userdoneCombo || Ext.create('Ext.form.ComboBox', {
	    hiddenName: 'userdone',
	    fieldLabel: '',
	    editable: false,
	    store: calUsers,
	    queryMode: 'local',
	    displayField: 'completename',
	    valueField: 'rowid',
	    renderTo: Ext.getBody()
	});

	this.startDayField = this.startDayField
	    || Ext.create('Ext.form.DateField', {
		fieldLabel : lan['startDayField.label'],
		value : new Date(),
		format : 'd-m-Y',
		allowBlank : false,
		flex : 2,
		editable : false,
		disabled : this.singleDay
	    });
	this.startDayField.on('select', this.onStartEndDayCheckFn, this);

	this.startTimeField = this.startTimeField
	    || Ext.create('Ext.form.ComboBox', {
		hideLabel : true,
		style : 'margin-left:5px;',
		labelSeparator : '',
		store : Ext.ux.calendar.Mask.getTimeStore(),
		displayField : 'hour',
		valueField : 'row',
		typeAhead : true,
		queryMode : 'local',
		triggerAction : 'all',
		selectOnFocus : true,
		allowBlank : false,
		editable : false,
		flex : 1
	    });
	this.startTimeField.on('select', this.onStartTimeSelectFn, this);

	this.endDayField = this.endDayField
	    || Ext.create('Ext.form.DateField', {
		style : 'margin-left:5px;',
		labelStyle : 'text-align:center;',
		fieldLabel : lan['endDayField.label'],
		labelSeparator : '',
		format : 'd-m-Y',
		value : new Date(),
		allowBlank : false,
		flex : 2,
		editable : false,
		disabled : this.singleDay
	    });
	this.endDayField.on('select', this.onStartEndDayCheckFn, this);

	this.endTimeField = this.endTimeField
	    || Ext.create('Ext.form.ComboBox', {
		style : 'margin-left:5px;',
		hideLabel : true,
		labelSeparator : '',
		store : Ext.ux.calendar.Mask.getTimeStore(),
		displayField : 'hour',
		valueField : 'row',
		typeAhead : true,
		queryMode : 'local',
		triggerAction : 'all',
		selectOnFocus : true,
		allowBlank : false,
		editable : false,
		flex : 1
	    });
	/*
	 * fix the max-height issue when the data is changed
	 */
	this.endTimeField.on('expand', function() {
	    var picker = this.endTimeField.getPicker();
	    var h = picker.getHeight(), max = picker.maxHeight;
	    if (h > max) {
		picker.setHeight(max);
	    }
	}, this);

	this.finishedTask = this.finishedTask 
	    || Ext.create('Ext.form.field.Checkbox', {
		style : 'margin-left:5px;',
		hideLabel : true,
		labelSeparator : '',
		boxLabel : 'Tâche terminée'
	    });
	

	this.wholeField = this.wholeField
	    || Ext.create('Ext.form.field.Checkbox', {
		style : 'margin-left:5px;',
		hideLabel : true,
		labelSeparator : '',
		boxLabel : lan['wholeField.label']
	    });
	this.wholeField.on('check', this.onWholeCheck, this);

	this.subjectField = this.subjectField
	    || Ext.create('Ext.form.TextField', {
		fieldLabel : lan['subjectField.label'],
		anchor : '100%'
	    });
	this.contentField = this.contentField
	    || Ext.create('Ext.form.TextArea', {
		fieldLabel : lan['contentField.label'],
		height : 70,
		anchor : '100%'
	    });

	this.uploadedFileList = this.uploadedFileList
	    || Ext.create('Ext.form.Label', {
		text: 'Fichiers associés :',
		id: 'uploadedFileList',
		hidden: false
	    });
	
	this.uploadFileBtn = this.uploadFileBtn
	    || Ext.create('Ext.Button', {
		text: 'Transmettre',
		handler : this.onUploadFileSubmitFn,
		scope : this
	    });

	Ext.define('UploadedFile', {
	    extend: 'Ext.data.Model',
	    fields: [ { name:  'filename', type: 'string' } ]
	});

	this.uploadedFilesStore = this.uploadedFilesStore 
	    || Ext.create('Ext.data.Store', {
		model: 'UploadedFile',
		data : []
	    });

	this.filesGrid = this.filesGrid 
	    || Ext.create('Ext.grid.Panel', {
		store: this.uploadedFilesStore,
		header: false,
		frame: false,
		frameHeader: false,
		columns: [
		    { id: 'filename', header: 'Nom', flex: 1, dataIndex: 'filename' },
		    {
			xtype: 'actioncolumn',
			width:30,
			sortable: false,
			items: [{
			    icon: Ext.ux.calendar.CONST.MAIN_PATH + 'image/delete.gif',
			    tooltip: 'Supprimer le fichier',
			    handler: function(grid, rowIndex, colIndex) {
				var file = grid.store.getAt(rowIndex);
				grid.store.removeAt(rowIndex); 
				Ext.Ajax.request({
				    url: Ext.ux.calendar.CONST.deleteUploadedFileURL,
				    params: { 'filename': file.data, 'calendarId': Ext.calendarId },
				    success: function(response) {
					alert(response.responseText);
					Ext.create('widget.uxNotification', {
					    position: 'r',
					    useXAxis: true,
					    cls: 'ux-notification-light',
					    iconCls: 'ux-notification-icon-information',
					    closable: false,
					    title: '',
					    html: response.responseText.filename + ' supprimé avec succes.',
					    slideInDuration: 800,
					    slideBackDuration: 1000,
					    autoCloseDelay: 2000,
					    slideInAnimation: 'elasticIn',
					    slideBackAnimation: 'elasticIn'
					}).show();
				    },
				    failure: function(fp, o) {
					Ext.Msg.alert('Error', response.errorInfo);
				    }
				});
			    }
			}]    
		    }
		],
		selModel: {
		    selType: 'cellmodel'
		},
		height: 100,
		width: '100%',
		renderTo: Ext.getBody()
	    });
	
	
	this.uploadFileField = this.uploadFileField 
	    || Ext.create('Ext.form.field.File', {
		name: 'filename',
		fieldLabel: 'Fichier',
		labelWidth: 50,
		msgTarget: 'side',
		allowBlank: false,
		anchor: '100%',
		buttonText: 'Chosissez un fichier ...'
	    });
	// this.onUploadFileSubmitFn()); 
	this.uploadFileField.on('change', this.onChangeFieldFileFn(this.up('form').getForm()), this);

	this.uploadFilePanel = this.uploadFilePanel 
	    || Ext.create('Ext.form.Panel', {
		title: 'Ajouter un fichier',
		width: 400,
		border: false,
		header: false,
		bodyStyle: 'background:none',
		bodyPadding: 0,
		frame: true,
		renderTo: Ext.getBody(),
		items: [ this.uploadFileField, this.filesGrid ]
		//     xtype: 'filefield',
		//     name: 'filename',
		//     fieldLabel: 'Fichier',
		//     labelWidth: 50,
		//     msgTarget: 'side',
		//     allowBlank: false,
		//     anchor: '100%',
		//     buttonText: 'Chosissez un fichier ...'
		// }],
		// buttons: [{
		//     text: 'Lancer Transmettre',
		//     handler: function() {
		// 	var form = this.up('form').getForm();
		// 	if(form.isValid()){
		// 	    form.submit({
		// 		url: 'fileUpload',
		// 		waitMsg: 'Transmition ...',
		// 		success: function(fp, o) {
		// 		    Ext.Msg.alert('Success', 'Your photo "' + o.result.file + 
		// 				  '" has been uploaded.');
		// 		}
		// 	    });
		// 	}
		//     }
		// }]
	    });

	
	// this.uploadFileBouton = this.uploadFileBouton || 
	//     Ext.button.ButtonView
	// this.uploadFileField = this.uploadFileField 
	//     || Ext.create('Ext.form.field.File', {
	// 	name: 'banniere', //  + this.bindEl.bindEvent.id,
	// 	fieldLabel: '',
	// 	border: false,
	// 	id: "uploadFileField",
	// 	bodyPadding: false,
	// 	labelWidth: 50,
	// 	msgTarget: 'side',
	// 	allowBlank: true,
	// 	anchor: '100%',
	// 	buttonText: 'Choisissez votre fichier...'
	//     });

	//     });
	
	// this.uploadFilePanel = this.uploadFilePanel 
	//     || Ext.create('Ext.form.Panel', {
	// 	title: 'Ajouter un fichier',
	// 	width: 400,
	// 	items: [this.uploadFileField, this.uploadedFileList],
	// 	buttons: [{
	// 	    text: 'Transmettre',
	// 	    handler: function() {
	// 		var form = this.up('form').getForm();
	// 		form.submit({
	// 		    url: 'fileUpload',
	// 		    waitMsg: 'Transimition en cours ...',
	// 		    success: function(fp, o) {
	// 			Ext.Msg.alert('Success', 'Your photo "' + o.result.file + '" has been uploaded.');
	// 		    }
	// 		});
	// 	    }
	// 	}]
		
	// 	// buttons: [this.uploadFileBtn]
	//     });

	var ctplstr = this.ehandler.cTplStr;
	this.calendarField = Ext.create('Ext.form.field.ComboBox', {
	    fieldLabel : lan['calendarField.label'],
	    anchor : '100%',
	    editable: false,
	    store : Ext.ux.calendar.Mask.getCalendarStore(),
	    displayField : 'title',
	    valueField : 'id',
	    queryMode : 'local',
	    listConfig : {
		getInnerTpl : function() {
		    return '<div class="x-combo-list-item">' + ctplstr
			+ '</div>';
		}
	    }
	});
	this.alertBtn = this.alertBtn || Ext.create("Ext.button.Button", {
	    text: "Ajouter une alerte",
	    scope: this,
	    handler: this.onAlertBtn
	});

	this.alertCB = this.alertCB || Ext.create('Ext.form.field.Checkbox', {
	    labelSeparator : '',
	    anchor : '100%',
	    style : 'padding-left:105px;',
	    boxLabel : lan['alertCB.label'],
	    handler : this.onAlertCheckFn,
	    scope : this
	});

	this.lockCB = this.lockCB || Ext.create('Ext.form.field.Checkbox', {
	    labelSeparator : '',
	    style : 'padding-left:105px;',
	    anchor : '100%',
	    boxLabel : lan['lockCB.label']
	});

	this.returnBtn = this.returnBtn || Ext.create('Ext.button.Button', {
	    iconCls : 'icon_feyaCalendar_door_out',
	    text : lan['returnBtn.text'],
	    handler : this.onReturnFn,
	    scope : this
	});

	this.saveBtn = this.saveBtn || Ext.create('Ext.button.Button', {
	    iconCls : 'icon_feyaCalendar_accept',
	    minWidth : 80,
	    text : lan['saveBtn.text'],
	    handler : this.onSaveFn,
	    scope : this
	});

	this.cancelBtn = this.cancelBtn || Ext.create('Ext.button.Button', {
	    iconCls : 'icon_feyaCalendar_cancel',
	    minWidth : 80,
	    text : lan['cancelBtn.text'],
	    handler : this.onCancelFn,
	    scope : this
	});

	this.timepanel = this.timepanel || Ext.create('Ext.Container', {
	    layout : {
		type : 'hbox'
	    },
	    style : 'overflow:hidden;padding-bottom:3px;',
	    items : [this.startDayField, this.startTimeField,
		     this.endDayField, this.endTimeField,
		     this.wholeField]
	});

	this.repeatTypeField = this.repeatTypeField
	    || Ext.create('Ext.form.field.ComboBox', {
		fieldLabel : lan['repeatTypeField.label'],
		labelSeparator : ':',
		store : Ext.ux.calendar.Mask.getRepeatTypeStore(),
		displayField : 'display',
		valueField : 'value',
		typeAhead : true,
		queryMode : 'local',
		triggerAction : 'all',
		selectOnFocus : true,
		allowBlank : false,
		editable : false,
		anchor : '100%'
	    });

	this.repeatIntervalField = Ext.create('Ext.form.NumberField', {
	    fieldLabel : lan['repeatIntervalField.label'],
	    labelSeparator : ':',
	    value : 1,
	    allowBlank : false,
	    minValue : 1,
	    validator : function(v) {
		if (v && 0 < v) {
		    var str = v.toString();
		    if (-1 == str.indexOf('.')) {
			return true;
		    }
		}
		return Ext.ux.calendar.Mask.Editor['repeatIntervalInvalid'];
	    }
	});
	this.repeatIntervalField
	    .on('valid', this.onRepeatIntervalValidFn, this);

	this.intervalUnitLabel = this.intervalUnitLabel
	    || Ext.create('Ext.form.Label', {
		style : 'padding-left:17px;line-height:22px;'
	    });

	this.repeatStartField = this.repeatStartField
	    || new Ext.form.DateField({
		fieldLabel : lan['repeatStartField.label'],
		format : 'Y-m-d',
		allowBlank : false,
		anchor : '90%',
		sender : this,
		validator : function(v) {
		    var ed = this.sender.repeatEndDateField;
		    if (ed.disabled
			|| v <= Ext.Date.format(ed.getValue(), 'Y-m-d')) {
			return true;
		    }
		    return Ext.ux.calendar.Mask.Editor['repeatBeginDayInvalid'];
		}
	    });
	this.repeatStartField.on('select', this.onRepeatStartSelectFn, this);

	this.repeatEndTimeField = this.repeatEndTimeField
	    || Ext.create('Ext.form.NumberField', {
		value : 10,
		allowBlank : false,
		disabled : true,
		validator : function(v) {
		    if (0 < v) {
			return true;
		    }
		    return Ext.ux.calendar.Mask.Editor['repeatTimeInvalid']
		}
	    });

	var lineHeight = 22;
	this.repeatNoEndRG = this.repeatNoEndRG
	    || Ext.create('Ext.form.field.Radio', {
		boxLabel : lan['repeatNoEndRG.label'],
		name : 'repeat-end-type',
		height : lineHeight
	    });

	this.repeatEndTimeRG = this.repeatEndTimeRG
	    || Ext.create('Ext.form.field.Radio', {
		boxLabel : lan['repeatEndTimeRG.label'],
		name : 'repeat-end-type',
		height : lineHeight
	    });

	this.repeatEndDateRG = this.repeatEndDateRG
	    || Ext.create('Ext.form.field.Radio', {
		boxLabel : lan['repeatEndDateRG.label'],
		name : 'repeat-end-type',
		height : lineHeight
	    });

	this.repeatEndDateField = this.repeatEndDateField
	    || Ext.create('Ext.form.DateField', {
		hideLabel : true,
		labelSeparator : '',
		format : 'Y-m-d',
		allowBlank : false,
		disabled : true,
		value : Ext.Date.add((new Date()), Ext.Date.DAY, 365),
		sender : this,
		validator : function(v) {
		    var sd = this.sender.repeatStartField;
		    if (v >= Ext.Date.format(sd.getValue(), 'Y-m-d')) {
			return true;
		    }
		    return Ext.ux.calendar.Mask.Editor['repeatEndDayInvalid'];
		}
	    });
	var checkListener = {
	    'change' : {
		fn : this.refreshRepeatInfo,
		scope : this
	    }
	};
	var items = [];
	var nd = new Date();
	var n = Ext.Date.format(nd, 'N');
	var mon = Ext.Date.add(nd, Ext.Date.DAY, 1 - n);
	for (var i = 0; i < 7; i++) {
	    items.push({
		boxLabel : Ext.Date.format(Ext.Date.add(mon,
							Ext.Date.DAY, i), 'D'),
		listeners : checkListener
	    });
	}

	this.weekCheckGroup = this.weekCheckGroup
	    || Ext.create('Ext.form.CheckboxGroup', {
		fieldLabel : lan['weekCheckGroup.label'],
		items : items,
		anchor : '100%'
	    });

	this.monthRadioGroup = this.monthRadioGroup
	    || Ext.create('Ext.form.RadioGroup', {
		fieldLabel : lan['monthRadioGroup.label'],
		items : [{
		    boxLabel : lan['repeatByDate'],
		    name : 'repeat-month-group',
		    checked : true
		}, {
		    boxLabel : lan['repeatByDay'],
		    name : 'repeat-month-group',
		    listeners : checkListener
		}],
		anchor : '60%'
	    });

	this.alertContainer = this.alertContainer
	    || Ext.create('Ext.Container', {
		hidden : !(Ext.ux.calendar.CONST.VERSION >= '2.0.5'),
		sender : this,
		autoHeight : true,
		style : 'padding: 0 0 0 100px;',
		buttons : [{
		    text : lan['newAlertBtn.text'],
		    handler : this.onAddAlertSettingFn,
		    scope : this
		}],
		buttonAlign : 'left'
	    });

	this.generalForm = this.generalForm
	    || Ext.create('Ext.form.FormPanel', {
		border : false,
		anchor : '100%',
		bodyStyle : 'padding:10px 20px;',
		frame : true,
		autoHeight : true,
		labelWidth : 80,
		items : [this.timepanel, this.subjectField,
			 this.contentField, 
			 this.finishedTask,
			 this.usertodoLabel,
			 this.usertodoCombo,
			 // this.userdoneLabel,
			 // this.userdoneCombo,
			 this.uploadFilePanel,
			 this.calendarField,
			 this.alertCB, this.alertBtn, 
			 this.alertContainer]
		// this.lockCB]
	    });

	this.repeatInfoPanel = this.repeatInfoPanel
	    || Ext.create('Ext.Container', {
		html : '<div class="x-repeat-event-info-ct"><div class="x-repeat-event-info"></div></div>'
	    });

	this.repeatForm = this.repeatForm || Ext.create('Ext.form.FormPanel', {
	    anchor : '100%',
	    border : false,
	    style : 'margin-top:20px;',
	    bodyStyle : 'padding:10px 20px;',
	    frame : true,
	    autoHeight : true,
	    labelWidth : 80,
	    items : [
		this.repeatTypeField,
		{
		    xtype : 'container',
		    style : 'padding-left:105px;',
		    layout : 'hbox',
		    items : [this.repeatIntervalField,
			     this.intervalUnitLabel]
		}, this.repeatInfoPanel, this.weekCheckGroup,
		this.monthRadioGroup, {
		    xtype : 'container',
		    style : 'padding-left:105px;',
		    layout : 'hbox',
		    items : [this.repeatStartField, {
			xtype : 'container',
			style : 'margin-left:17px;',
			items : [this.repeatNoEndRG, this.repeatEndTimeRG,
				 this.repeatEndDateRG]
		    }, {
			xtype : 'container',
			style : 'margin-left:10px;margin-top:'
			    + (lineHeight + 4) + 'px;',
			items : [this.repeatEndTimeField,
				 this.repeatEndDateField]
		    }, {
			xtype : 'label',
			html : lan['repeatEndTimeUnit'],
			style : 'line-height:22px;margin-left:10px;margin-top:'
			    + (lineHeight + 4) + 'px;'
		    }]
		}]
	});

	Ext.apply(this, {
	    autoScroll : true,
	    buttonAlign : 'center',
	    layout : 'anchor',
	    bodyStyle : 'padding:10px;',
	    items : [this.generalForm, this.repeatForm],
	    buttons : [this.returnBtn, this.saveBtn, this.cancelBtn]
	})
	this.callParent(arguments);
	this.addEvents('showdetailsetting');
	this.repeatTypeField.on('select', this.onRepeatTypeSelectFn, this);
	this.calendarField.on('select', this.onCalendarSelectFn, this);
	this.repeatNoEndRG.on('change', this.onRepeatNoEndCheckFn, this);
	this.repeatEndTimeRG.on('change', this.onRepeatEndTimeCheckFn, this);
	this.repeatEndDateRG.on('change', this.onRepeatEndDateCheckFn, this);
    },

    onRepeatIntervalValidFn : function() {
	this.refreshRepeatInfo();
    },
    onRepeatStartSelectFn : function(df) {
	this.refreshRepeatInfo();
    },

    refreshRepeatInfo : function() {
	var vDate = Ext.Date;
	var beginDate = this.repeatStartField.getValue();
	var intervalSlot = this.repeatIntervalField.getValue();
	var getIntervalText = Ext.ux.calendar.Mask.getIntervalText;
	var lan = Ext.ux.calendar.Mask.Editor;
	var v = this.repeatTypeField.getValue();
	var str = '';
	if ('day' == v) {
	    this.updateRepeatInfo(getIntervalText(v, intervalSlot));
	} else if ('week' == v) {
	    var monday = vDate.add(beginDate, Ext.Date.DAY, 1
				   - vDate.format(beginDate, 'N'));
	    var cbs = this.weekCheckGroup.items;
	    var num = 0;
	    for (var i = 0, len = cbs.getCount(); i < len; i++) {
		var cb = cbs.get(i);
		if (cb.getValue()) {
		    num++;
		    str += vDate
			.format(vDate.add(monday, Ext.Date.DAY, i), 'l')
			+ ' ';
		}
	    }
	    if (7 == num) {
		str = lan['repeatDayInfo'];
	    } else if (0 == num) {
		str = vDate.format(beginDate, 'l')
	    }
	    this.updateRepeatInfo(getIntervalText(v, intervalSlot) + str);
	} else if ('month' == v) {
	    var rds = this.monthRadioGroup.items;
	    if (rds.get(1).getValue()) {
		str = Ext.ux.calendar.Mask.getWeekDayInMonth(beginDate);
	    } else {
		str = vDate.format(beginDate, 'd');
	    }
	    this.updateRepeatInfo(getIntervalText(v, intervalSlot) + str);
	} else if ('year' == v) {
	    this.updateRepeatInfo(getIntervalText(v, intervalSlot)
				  + vDate.format(beginDate, 'm-d'));
	}
    },

    updateRepeatInfo : function(html) {
	var div = this.repeatInfoPanel.getEl().dom.firstChild.firstChild;
	div.innerHTML = html;
    },

    // onChangeFileUploadFn : function(
    onRepeatTypeSelectFn : function(combo, rd, index) {
	var v = combo.getValue();
	this.resetRepeatSetting(v, this.bindEl.bindEvent);
    },

    resetRepeatSetting : function(v, event) {
	var rt = event.repeatType || 'no';
	var lan = Ext.ux.calendar.Mask.Editor;
	var items = this.repeatForm.items;
	if ('no' == v || 'exception' == v) {
	    items.get(1).hide();
	    items.get(2).hide();
	    items.get(3).hide();
	    items.get(4).hide();
	    items.get(5).hide();
	} else {
	    items.get(1).show();
	    items.get(2).show();
	    if ('day' == v || 'year' == v) {
		if ('day' == v) {
		    this.intervalUnitLabel
			.setText(lan['intervalUnitLabel.day.text']);
		} else {
		    this.intervalUnitLabel
			.setText(lan['intervalUnitLabel.year.text']);
		}
		items.get(3).hide();
		items.get(4).hide();
	    } else if ('week' == v) {
		this.intervalUnitLabel
		    .setText(lan['intervalUnitLabel.week.text']);
		items.get(3).show();
		this.weekCheckGroup.reset();
		var cbs = this.weekCheckGroup.items;
		if ('string' != Ext.ux.calendar.Mask.typeOf(rt)) {
		    var rday = rt.rday;
		    for (var p in rday) {
			cbs.get(p - 1).setValue(true);
		    }
		}
		items.get(4).hide();
	    } else if ('month' == v) {
		this.intervalUnitLabel
		    .setText(lan['intervalUnitLabel.month.text']);
		items.get(3).hide();
		items.get(4).show();
		this.monthRadioGroup.reset();
		var rds = this.monthRadioGroup.items;
		if ('string' != Ext.ux.calendar.Mask.typeOf(rt)) {
		    var rby = rt.rby;
		    if ('day' == rby) {
			rds.get(1).setValue(true);
		    } else {
			rds.get(0).setValue(true);
		    }
		}
	    }
	    items.get(5).show();
	    this.repeatForm.doLayout();
	    this.repeatNoEndRG.checked = false;
	    this.repeatEndTimeRG.checked = false;
	    this.repeatEndDateRG.checked = false;
	    if ('string' != Ext.ux.calendar.Mask.typeOf(rt)) {
		this.repeatIntervalField.setValue(rt.intervalSlot);
		this.repeatStartField.setValue(rt.beginDay);
		if ('no' == rt.endDay) {
		    if (false != Ext.ux.calendar.Mask.typeOf(rt.rtime)) {
			this.repeatEndTimeRG.setValue(true);
			this.repeatEndTimeField.setValue(rt.rtime)
		    } else {
			this.repeatNoEndRG.setValue(true);
		    }
		} else {
		    this.repeatEndDateRG.setValue(true);
		    this.repeatEndDateField.setValue(rt.endDay);
		}
	    } else {
		if ('day' == v) {
		    this.repeatIntervalField.setValue(Ext.ux.calendar.Mask
						      .getDayOffset(event.day, event.eday)
						      + 1);
		} else {
		    this.repeatIntervalField.setValue(1);
		}
		this.repeatStartField.setValue(event.day);
		this.repeatNoEndRG.setValue(true);
	    }
	    this.refreshRepeatInfo();
	}
    },
    onChangeFieldFileFn: function(this, form) {
	//var form = this.up('form').getForm();
	form.submit({
	    url: Ext.ux.calendar.CONST.uploadFileURL,
	    waitMsg: 'Transmition ...',
	    params: {
		'cal_id': Ext.calendarId,
		'event_id': Ext.eventId
	    },
	    success: function(fp, o) {
		alert(this.uploadedFilesStore.getAt(0).filename);
		this.uploadedFilesStore.insert(0, Ext.create('UploadedFile', 
					   { filename: o.result.filename }));
                Ext.create('widget.uxNotification', {
                    position: 'r',
                    useXAxis: true,
                    cls: 'ux-notification-light',
                    iconCls: 'ux-notification-icon-information',
                    closable: false,
                    title: 'Information',
                    html: "'Votre fichier \'" + o.result.filename + 
			'\' à bien été transmis.',
                    slideInDuration: 800,
                    slideBackDuration: 1000,
                    autoCloseDelay: 2000,
                    slideInAnimation: 'elasticIn',
                    slideBackAnimation: 'elasticIn'
                }).show();

                cellEditing.startEditByPosition({row: 0, column: 0});

	    },
	    failure: function(fp, o) {
		Ext.Msg.alert('Error', o.result.errorInfo);
	    }
	});
    },

    onChangeFn : function(ro, nval, oval) {
	if (nval) {
	    this.ownerCt.westtoolbar.setBtnToggle(ro.inputValue)
	}
    },
    onRepeatNoEndCheckFn : function(cb, checked) {
	if (checked) {
	    this.repeatEndTimeField.disable();
	    this.repeatEndDateField.disable();
	}
    },

    onRepeatEndTimeCheckFn : function(cb, checked) {
	if (checked) {
	    this.repeatEndTimeField.enable();
	    this.repeatEndDateField.disable();
	}
    },

    onRepeatEndDateCheckFn : function(cb, checked) {
	if (checked) {
	    this.repeatEndTimeField.disable();
	    this.repeatEndDateField.enable();
	}
	this.repeatEndDateField.setValue(this.repeatEndDateField.getValue());
	// this.repeatEndDateField.isValid();
    },

    onReturnFn : function() {
	var calendarContainer = this.ownerCt;
	var cview = this.bview;
	calendarContainer.getLayout().setActiveItem(cview);
	cview.checkLayout(true);
    },

    onStartEndDayCheckFn : function(df) {
	var sdate = this.startDayField.getValue();
	var sday = Ext.Date.format(sdate, 'Y-m-d');
	var edate = this.endDayField.getValue();
	var eday = Ext.Date.format(edate, 'Y-m-d');
	if (sday >= eday) {
	    if (df == this.startDayField) {
		this.endDayField.setValue(sdate);
	    } else if (df == this.endDayField) {
		this.startDayField.setValue(edate);
	    }
	    var sv = this.startTimeField.getValue();
	    var ev = this.endTimeField.getValue();
	    this.reloadEndTimeStore(sv);
	    if (sv > ev) {
		ev = sv + this.numInHour;
		if (ev >= this.activeEndRow) {
		    ev = this.activeEndRow - 1;
		}
		this.endTimeField.setValue(ev);
	    }
	} else {
	    this.reloadEndTimeStore(null, true);
	}
    },

    reloadStartTimeStore : function(all) {
	var store = this.startTimeField.store;
	store.removeAll();
	var data;
	if (all || !this.hideInactiveRow) {
	    data = Ext.ux.calendar.Mask.generateIntervalData(this.intervalSlot,
							     0, this.rowCount - 1, this.ehandler.hourFormat);
	} else {
	    data = Ext.ux.calendar.Mask.generateIntervalData(this.intervalSlot,
							     this.activeStartRow, this.activeEndRow - 1,
							     this.ehandler.hourFormat);
	}
	store.loadData(data);
    },

    reloadEndTimeStore : function(sIndex, all) {
	var store = this.endTimeField.store;
	store.removeAll();
	var data;
	if (all) {
	    data = Ext.ux.calendar.Mask.generateIntervalData(this.intervalSlot,
							     0, this.rowCount, this.ehandler.hourFormat);
	} else {
	    if (false == Ext.ux.calendar.Mask.typeOf(sIndex)) {
		if (this.hideInactiveRow) {
		    sIndex = this.activeStartRow;
		} else {
		    sIndex = 0;
		}
	    } else {
		sIndex++;
	    }
	    if (this.hideInactiveRow) {
		data = Ext.ux.calendar.Mask.generateIntervalData(
		    this.intervalSlot, sIndex, this.activeEndRow,
		    this.ehandler.hourFormat);
	    } else {
		data = Ext.ux.calendar.Mask.generateIntervalData(
		    this.intervalSlot, sIndex, this.rowCount,
		    this.ehandler.hourFormat);
	    }
	}
	store.loadData(data);
    },

    onStartTimeSelectFn : function(combo, rd, index) {
	var v = combo.getValue();
	var eIndex;
	var sday = Ext.Date.format(this.startDayField.getValue(), 'Y-m-d');
	var eday = Ext.Date.format(this.endDayField.getValue(), 'Y-m-d');
	if (this.bindEl) {
	    var event = this.bindEl.bindEvent;
	    if (sday != eday) {
		this.reloadEndTimeStore();
	    } else {
		var span = event.endRow - event.startRow;
		eIndex = v + span;
		this.reloadEndTimeStore(v);
	    }
	}

	if (false != Ext.ux.calendar.Mask.typeOf(eIndex)) {
	    if (this.hideInactiveRow) {
		if (this.activeEndRow >= eIndex) {
		    this.endTimeField.setValue(eIndex);
		} else {
		    this.endTimeField.setValue(this.activeEndRow);
		}
	    } else {
		if (this.rowCount >= eIndex) {
		    this.endTimeField.setValue(eIndex);
		} else {
		    this.endTimeField.setValue(this.rowCount);
		}
	    }
	}
    },

    onUploadFileSubmitFn: function() {
	ev_id = '';
	cal_id = '';
	html = '';

	filename = this.uploadFileField.getValue();
//	console.log("filename <"+filename+">");
	// alert(filename);
	store = this.calendarField.store;
	value = this.calendarField.getValue();
	alert(value);
	index = store.find('id', value);
	rd = store.getAt(index);

	if(this.bindEl) {
	    ev_id = this.bindEl.bindEvent.eventId;
	    cal_id = this.bindEl.bindEvent.calendarId;
	}

	if(value.length == 0) {
	    html = 'Merci de faire le choix de l\'agenda';
	}
	if(ev_id == '' || ev_id == undefined) {
	    html = 'Désolé mais vous devez créer l\'action first';
	}
	// alert("id event : " + ev_id);
	if(html != '') {
	    Ext.create('widget.uxNotification', {
		position: 'r',
		useXAxis: true,
		cls: 'ux-notification-light',
		iconCls: 'ux-notification-icon-information',
		closable: false,
		title: 'Attention!',
		html: 'Merci de faire le choix de l\'agenda',
		slideInDuration: 800,
		slideBackDuration: 500,
		autoCloseDelay: 1000,
		slideInAnimation: 'elasticIn',
		slideBackAnimation: 'elasticIn'
	    }).show();
	    return false;
	}
	form = this.uploadFilePanel.getForm();
	if(form.isValid()){
	    form.submit({
		params: { event_id: ev_id,  cal_value: value, cal_idx: index, cal_rd: rd,
			  cal_id2: cal_id },
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
	// alert(filename);
	this.uploadFileField.setValue(filename);
    },
    onCalendarSelectFn : function(field, val, options) {
	var coverEl = this.bindEl;
	if (coverEl && !coverEl.hold) {
	    var event = coverEl.bindEvent;
	    var cview = coverEl.cview;
	    var eh = cview.ehandler;
	    /*
	     * get the selected rd, fix bug74, it's because extjs4 changed the
	     * 'select' event of combobox
	     */
	    var store = this.calendarField.store;
	    var value = this.calendarField.getValue();
//	    console.log("VALUE <"+value+">");
//	    console.log("id <"+store.find('id', value)+">");
	    if(value == 4 || value == 3) {
//		console.log("value <"+value+">");
		this.startTimeField.hide();
		this.endTimeField.hide();
		this.wholeField.fireEvent('check');
		// this.wholeField.setValue(true);
		this.wholeField.hide();
		// this.startTimeField.setDisabled(true);
		// this.endTimeField.setDisabled(true);
	    }
	    var index = store.find('id', value);
	    var rd = store.getAt(index);

	    var color = eh.calendarSet[rd.data.id].color;
	    var arr = Ext.DomQuery.select('div[name=x-event-' + event.day + '-'
					  + event.eday + '-' + event.eventId + ']',
					  cview.body.dom);
	    for (var i = 0, len = arr.length; i < len; i++) {
		coverEl = Ext.get(arr[i]);
		if (coverEl instanceof Ext.Element) {
		    if (0 == event.startRow && this.rowCount == event.endRow) {
			if (this.oldColor != color) {
			    eh.changeWholeColor(coverEl, this.oldColor, color);
			}
		    } else {
			if (this.oldColor != color) {
			    if (cview instanceof Ext.ux.calendar.view.DayView) {
				eh.changeEventColor(coverEl, this.oldColor,
						    color);
			    } else {
				eh.changeLegendColor(coverEl, this.oldColor,
						     color);
			    }
			}
		    }
		}
	    }
	}
	this.oldColor = color;
    },

    onWholeCheck : function() {
	var sday = Ext.Date.format(this.startDayField.getValue(), 'Y-m-d');
	var eday = Ext.Date.format(this.endDayField.getValue(), 'Y-m-d');
	if (this.bindEl) {
	    var event = this.bindEl.bindEvent;
	    if (this.wholeField.checked) {
		var getHMFromRow = Ext.ux.calendar.Mask.getHMFromRow;
		this.reloadStartTimeStore(true);
		this.reloadEndTimeStore(null, true);
		this.startTimeField.setRawValue(getHMFromRow(this.intervalSlot,
							     0, this.hourFormat));
		this.endTimeField.setRawValue(getHMFromRow(this.intervalSlot,
							   this.rowCount, this.hourFormat));
		this.startTimeField.disable();
		this.endTimeField.disable();
	    } else {
		var startRow, endRow;
		startRow = (this.activeStartRow <= event.startRow)
		    ? event.startRow
		    : this.activeStartRow;
		endRow = (this.activeEndRow >= event.endRow)
		    ? event.endRow
		    : this.activeEndRow - 1;
		this.reloadStartTimeStore();
		this.startTimeField.setValue(startRow);
		if (sday == eday && this.rowCount != event.endRow) {
		    this.reloadEndTimeStore(startRow);
		} else {
		    this.reloadEndTimeStore();
		}
		this.endTimeField.setValue(endRow);
		this.startTimeField.enable();
		this.endTimeField.enable();
	    }
	    this.startDayField.setValue(event.day);
	    this.endDayField.setValue(event.eday);
	    // this.usertodoCombo.setValue(event.usertodo);
	    // this.userdoneCombo.setValue(event.userdone);
	}
    },

    checkAlertValid : function() {
	var flag = true;
	this.alertContainer.items.each(function(it) {
	    if (!it.isValid()) {
		flag = false;
		return false;
	    }
	});
	return flag;
    },

    onSaveFn : function() {
	var vDate = Ext.Date;
//	console.log("onsave 1");
//	console.log("this.generalForm.getForm().isValid(): " + this.generalForm.getForm().isValid());
//	console.log("this.repeatForm.getForm().isValid() : " + this.repeatForm.getForm().isValid());
//	console.log("this.checkAlertValid(): " + this.checkAlertValid());
	// if (this.generalForm.getForm().isValid()
	if(this.repeatForm.getForm().isValid()
	   && this.checkAlertValid()) {
//	    console.log("onsave 2");
	    if (this.bindEl) {
//		console.log("onsave 3");
		var coverEl = this.bindEl;
		var event = coverEl.bindEvent;
		var oevent = Ext.apply({}, event);
		var cview = coverEl.cview;
		var eh = cview.ehandler;
		if ('add' == this.action && !coverEl.hold) {
		    coverEl.remove();
		}
		// check whether this is all day
		if (this.wholeField.checked) {
		    event.tlj = true;
		    event.allDay = true;
		    event.startRow = 0;
		    event.endRow = this.rowCount;
		} else {
		    event.startRow = parseInt(this.startTimeField.getValue());
		    event.endRow = parseInt(this.endTimeField.getValue());
		}
		event.day = vDate
		    .format(this.startDayField.getValue(), 'Y-m-d');
		var edate = this.endDayField.getValue();
		if (0 == event.endRow) {
		    edate = vDate.add(edate, Ext.Date.DAY, -1);
		    event.endRow = this.rowCount;
		}
		event.eday = vDate.format(edate, 'Y-m-d');
		event.subject = this.subjectField.getValue();
		event.content = this.contentField.getValue();
		event.usertodo = this.usertodoCombo.getValue();
		// event.userdone = this.userdoneCombo.getValue();
		// event.uploadfile = this.fileUploadBasic.getValue();

		
		// event.calendarId = bindEvent.calendarId; 
		// alert(event.calendarId);
		// alert(this.calendarField.getValue());
		event.calendarId = this.calendarField.getValue();
		// alert("calendarfield.getvalue " + event.calendarId);
		// alert("bindEvent.calendarId " + bindEvent.calendarId);


		store = this.calendarField.store;
		value = this.calendarField.getValue();
		// index = store.find('id', value);
		// rd = store.getAt(index);
		
		store.each(function(ele, scope) { 
		    if(ele.get("title") == value) { 
			event.calendarId = ele.get("id");
		    }
		});

		if(event.calendarId == 3 || event.calendarId == 4) {
//		    console.log("calendarId " + event.calendarId);
		    event.allDay = true;
		    event.startRow = 0;
		    // this.wholeField.fireEvent("check");
		}
		event.color = eh.calendarSet[event.calendarId].color;
		if (this.alertCB.checked) {
		    event.alertFlag = this.getAlertSetting();
		    this.alertBtn.setDisabled(false);
		} else {
		    delete(event.alertFlag);
		    this.alertBtn.setDisabled(true);
		}
		if(this.finishedTask.checked) {
		    event.finished = true;
		}
		event.locked = false; // this.lockCB.checked || false;
		// continue in repeat type
		event = this.handleRepeatType(event);
		event.uploads = this.uploadFileField.getValue();
		if ('add' == this.action) {
		    if ('string' == Ext.ux.calendar.Mask
			.typeOf(event.repeatType)) {
			filename = this.uploadFileField.getValue();
//			console.log("filename in save <"+this.uploadFileField.getValue()+">");
			// this.fireEvent('uploadFile');
			eh.createEvent(event, this.uploadFilePanel, this.calendarField.getValue(), cview);
//			console.log("apres creation <"+event.eventId+">");
		    } else {
			eh.createRepeatEvent(event, cview);
		    }
		} else if ('update' == this.action) {
//		    console.log("onSave: update");
		    if (!Ext.ux.calendar.Mask.isEqualObj(oevent, event)) {
			if ('string' == Ext.ux.calendar.Mask
			    .typeOf(oevent.repeatType)
			    && 'string' == Ext.ux.calendar.Mask
			    .typeOf(event.repeatType)) {
			    event.repeatType = oevent.repeatType;
			    eh.updateEvent(event, cview, null, oevent,
					   this.noLayout);
			} else {
			    if ('string' != Ext.ux.calendar.Mask
				.typeOf(oevent.repeatType)) {
				/*
				 * need ask user to choose apply all or just
				 * current one
				 */
				var lan = Ext.ux.calendar.Mask.EventHandler;
				Ext.Msg.show({
				    title : lan['updateRepeatPopup.title'],
				    msg : lan['updateRepeatPopup.msg'],
				    buttons : Ext.Msg.YESNOCANCEL,
				    fn : function(bid, text) {
					if ('yes' == bid) {
					    eh.updateRepeatEvent(event,
								 cview, oevent);
					} else if ('no' == bid) {
					    event.repeatType = 'exception';
					    eh.updateRepeatEvent(event,
								 cview, oevent);
					}
				    },
				    icon : Ext.MessageBox.QUESTION
				});
			    } else {
				eh.updateRepeatEvent(event, cview, oevent);
			    }
			}
		    }
		}
	    }
	    cview.fireEvent('canceldetail');
	    this.onReturnFn();
	}
    },

    handleRepeatType : function(e) {
	var vDate = Ext.Date;
	var event = Ext.apply({}, e);
	var nrt = this.repeatTypeField.getValue();
	if ('no' == nrt) {
	    event.repeatType = 'no';
	} else {
	    var o = {
		rtype : nrt,
		intervalSlot : this.repeatIntervalField.getValue(),
		dspan : Ext.ux.calendar.Mask.getDayOffset(e.day, e.eday),
		beginDay : Ext.Date.format(this.repeatStartField.getValue(),
					   'Y-m-d')
	    };
	    if (this.repeatNoEndRG.checked) {
		o.endDay = 'no';
	    } else if (this.repeatEndTimeRG.getValue()) {
		o.endDay = 'no';
		o.rtime = this.repeatEndTimeField.getValue();
	    } else if (this.repeatEndDateRG.getValue()) {
		o.endDay = Ext.Date.format(this.repeatEndDateField.getValue(),
					   'Y-m-d');
	    }
	    if ('week' == nrt) {
		var obj = {};
		var items = this.weekCheckGroup.items;
		var flag = false;
		for (var i = 0, len = items.getCount(); i < len; i++) {
		    var it = items.get(i);
		    if (it.getValue()) {
			flag = true;
			obj[i + 1] = true;
		    }
		}
		if (!flag) {
		    var n = vDate.format(vDate.parseDate(event.day, 'Y-m-d'),
					 'N');
		    obj[n] = true;
		}
		o.rday = obj;
	    } else if ('month' == nrt) {
		var items = this.monthRadioGroup.items;
		if (true == items.get(0).getValue()) {
		    o.rby = 'date';
		} else {
		    o.rby = 'day';
		}
	    }
	    event.repeatType = o;
	}
	return event;
    },

    onCancelFn : function() {
	var coverEl = this.bindEl;
	var coverEl = this.bindEl;
	if (coverEl) {
	    var cview = coverEl.cview;
	    var event = coverEl.bindEvent;
	    var eh = cview.ehandler;
	    if (!coverEl.hold) {
		if ('add' == this.action) {
		    this.bindEl.remove();
		} else {
		    var color = eh.calendarSet[event.calendarId].color;
		    if (0 == event.startRow && this.rowCount == event.endRow) {
			if (this.oldColor != color) {
			    eh.changeWholeColor(coverEl, this.oldColor, color);
			}
		    } else {
			if (this.oldColor != color) {
			    if (cview instanceof Ext.ux.calendar.DayView) {
				eh.changeEventColor(coverEl, this.oldColor,
						    color);
			    } else {
				eh.changeLegendColor(coverEl, this.oldColor,
						     color);
			    }
			}
		    }
		}
	    }
	    this.onReturnFn();
	}
    },

    setup : function(obj) {
	this.noLayout = obj.noLayout;
	this.bindEl = obj.bindEl;
	this.action = obj.action;
	this.bview = obj.cview;
	if (this.bindEl) {
	    var coverEl = this.bindEl;
	    var cview = coverEl.cview;
	    var eh = cview.ehandler;
	    if (coverEl instanceof Ext.Element) {
		eh.setEditingStatus(coverEl, true);
	    }
	    var bindEvent = coverEl.bindEvent;
	    this.reloadStartTimeStore();
	    this.reloadEndTimeStore();
	    // check whether it is whole day
	    if (bindEvent.tlj == true || (bindEvent.endRow == this.rowCount && bindEvent.startRow == 0)) {
		this.wholeField.setValue(true);
		this.startTimeField.hide();
		this.endTimeField.hide();
	    } else {
		if (this.wholeField.getValue()) {
		    this.wholeField.setValue(false);
		} else {
		    this.reloadStartTimeStore();
		    if (bindEvent.day != bindEvent.eday) {
			this.reloadEndTimeStore();
		    } else {
			this.reloadEndTimeStore(bindEvent.startRow);
		    }
		}
	    }

	    Ext.eventId = bindEvent.eventId;
	    Ext.calendarId = bindEvent.calendarId;

	    this.repeatStartField.setValue(bindEvent.day);
	    this.subjectField.setValue(bindEvent.subject);
//	    console.log("setup uploaded files <"+bindEvent.uploads+">");
	    // this.uploadedFileList.text = bindEvent.uploads;

	    var uploads = undefined;
	    if(bindEvent.uploads != 'false') {
		for(var i = 0; i < bindEvent.uploads.length; i++) {
		    var upFile = Ext.create('UploadedFile', { filename: bindEvent.uploads[i] });
		    this.uploadedFilesStore.add(upFile);
		}
	    }

	    // this.uploadedFileList.setText("Fichiers associés : "+bindEvent.uploads);
	    this.contentField.setValue(bindEvent.content);
	    this.startDayField.setValue(bindEvent.day);
	    this.endDayField.setValue(bindEvent.eday);
	    this.finishedTask.setValue(bindEvent.finished);

	    // alert("bind usertodo " + bindEvent.usertodo);
	    // alert("bind userdone " + bindEvent.userdone);

	    this.usertodoCombo.select(bindEvent.usertodo);
	    // this.userdoneCombo.setValue(bindEvent.userdone);

	    var v = 'no';
	    var rt = bindEvent.repeatType;
	    if (rt && 'string' != Ext.ux.calendar.Mask.typeOf(rt)) {
		v = rt.rtype;
	    }
	    if ('exception' == v) {
		v = 'no';
	    }
	    this.repeatTypeField.setValue(v);
	    this.resetRepeatSetting(v, bindEvent);
	    var alertFlag = bindEvent.alertFlag;
	    if (alertFlag) {
		this.alertCB.setValue(true);
		//this.setupAlertSetting(alertFlag);
	    } else {
		this.alertCB.setValue(false);
		//this.resetAlertSetting(alertFlag);
	    }
	    if (bindEvent.locked) {
		this.lockCB.setValue(true);
	    } else {
		this.lockCB.setValue(false);
	    }
	    this.reloadCalendar(eh);
	    
	    if(bindEvent.subject == undefined) { // new event
		this.calendarField.setValue("");
		this.startTimeField.setValue(bindEvent.startRow);
		this.endTimeField.setValue(bindEvent.endRow);
	    } else {
		this.calendarField.select(eh.calendarSet[bindEvent.calendarId].name);
//		console.log("setup: calendarId " + bindEvent.calendarId);
		if(bindEvent.calendarId == 3 || bindEvent.calendarId == 4) {
		    this.startTimeField.hide();
		    this.endTimeField.hide();
		    this.wholeField.hide();
		} else {
		    this.startTimeField.setValue(bindEvent.startRow);
		    this.endTimeField.setValue(bindEvent.endRow);
		}

		// this.calendarField.setValue(eh.calendarSet[bindEvent.calendarId].name);
	    }
	    // this.calendarField.setValue(bindEvent.calendarId);
	    this.oldColor = eh.calendarSet[bindEvent.calendarId].color;
	} else {
	    this.wholeField.setValue(true);
	}
	this.generalForm.doLayout();
	this.repeatForm.doLayout();
    },

    reloadCalendar : function(eh) {
	var store = this.calendarField.store;
	store.removeAll();
	for (var p in eh.calendarSet) {
	    var calendar = eh.calendarSet[p];
	    if (true !== calendar.hide) {
		var rd = new (store.model)({
		    id : calendar.id,
		    title : calendar.name,
		    description : calendar.description,
		    color : calendar.color
		});
		store.add(rd);
	    }
	}
    },

    onAlertBtn: function() {
	this.alertContainer.add(new Ext.ux.calendar.AlertSetting({
	    onRemoveAlertFn: this.onRemoveAlertFn
	}));
	this.alertContainer.doLayout();
    },
    onAlertCheckFn : function(cb, checked) {
	if (Ext.ux.calendar.CONST.VERSION >= '2.0.5') {
	    if (checked) {
		this.alertBtn.setDisabled(false);
		this.alertContainer.show();
		if (!this.alertContainer.items
		    || 0 == this.alertContainer.items.getCount()) {
		    this.alertContainer.add(new Ext.ux.calendar.AlertSetting({
			onRemoveAlertFn : this.onRemoveAlertFn
		    }));
		    this.alertContainer.doLayout();
		}
	    } else {
		this.alertContainer.hide();
		this.resetAlertSetting()
		this.alertBtn.setDisabled(true);
	    }
	}
    },

    getAlertSetting : function() {
	if (Ext.ux.calendar.CONST.VERSION >= '2.0.5') {
	    var arr = [];
	    var act = this.alertContainer;
	    for (var i = 0, len = act.items.getCount(); i < len; i++) {
		arr.push(act.items.get(i).getSetting());
	    }
	    return arr;
	} else {
	    return [{
		type : 'popup',
		early : 0,
		unit : 'minute'
	    }];
	}
    },

    onAddAlertSettingFn : function() {
	this.alertContainer.add(new Ext.ux.calendar.AlertSetting({
	    onRemoveAlertFn : this.onRemoveAlertFn
	}));
	this.alertContainer.doLayout();
    },

    resetAlertSetting : function() {
	if (Ext.ux.calendar.CONST.VERSION >= '2.0.5') {
	    var act = this.alertContainer;
	    act.items.each(function(it) {
		act.remove(it, true);
	    });
	    this.alertContainer.hide();
	}
    },

    setupAlertSetting : function(alertSetting) {
	if (Ext.ux.calendar.CONST.VERSION >= '2.0.5') {
	    this.alertContainer.show();
	    var act = this.alertContainer;
	    if (alertSetting && 0 < alertSetting.length) {
		var len = alertSetting.length;
		var count = act.items.getCount();
		for (var i = count; i < len; i++) {
		    act.add(new Ext.ux.calendar.AlertSetting({
			onRemoveAlertFn : this.onRemoveAlertFn
		    }));
		}
		for (var i = 0; i < len; i++) {
		    var as = act.items.get(i);
		    as.setup(alertSetting[i]);
		}
		this.alertContainer.doLayout();
	    }
	}
    },

    onRemoveAlertFn : function() {
	var ct = this.ownerCt;
	/*ct.remove(this, true);
	  if (0 == ct.items.getCount()) {
	  ct.sender.alertCB.setValue(false);
	  } else {
	  ct.doLayout();
	  }*/
	ct.sender.alertCB.setValue(false);
    }
});

Ext.define('Ext.ux.calendar.AlertSetting', {
    extend : 'Ext.form.FormPanel',
    initComponent : function() {
	var lan = Ext.ux.calendar.Mask.Editor;

	this.deleteAlertBtn = this.deleteAlertBtn
	    || Ext.create('Ext.button.Button', {
		text : lan['deleteAlertBtn.label'],
		style : 'margin-left:50px;',
		handler : this.onRemoveAlertFn,
		scope : this
	    });
	// this.addAlertBtn = this.addAlertBtn 
	// 	|| Ext.create('Ext.button.Button', {
	// 	    text: 'Ajouter une alerte',
	// 	    style: 'margin-left: 50px',
	// 	    hanlder: this.onAddAlertFn,
	// 	    scope: this
	// 	});

	// this.emailsPanel = this.emailsPanel ||
	// 	Ext.create('Ext.panel.Panel', {
	// 	    title: "Addresses couriels (séparées par des virugules)",
	// 	    border: false,
	// 	    header: false,
	// 	    bodyPadding: 0,
	// 	    frame: 0,
	// 	    renderTo: Ext.getBody(),
	// 	    items: [{
	// 		xtype: 'TextField',
	// 		allowBlank: false,
	// 		anchor: '100%',
	// 		name: 'emails',
	// 		value: 'e.pecqueur@aerocontact.com,\n' +
	// 		    'r.delandesen@aerocontact.com,\n mvignes@jobenfance.com'
	// 	    }]
	// 	});
	this.emailsAddrField = this.emailsAddrField ||
	    Ext.create('Ext.form.TextArea', {
		fieldLabel : "Addresses couriels (séparées par des virugules)",
		msgTarget: 'top',
		height: 100,
		width: 300,
		anchor : '100%',
		allowBlank: false,
		value:'e.pecqueur@aerocontact.com,\n' +
		    'r.delandesen@aerocontact.com,\nmvignes@jobenfance.com'
	    });

	this.alertTypeField = this.alertTypeField
	    || Ext.create('Ext.form.field.ComboBox', {
		hideLabel : true,
		labelSeparator : '',
		store : Ext.ux.calendar.Mask
		    .getAlertTypeStore(),
		displayField : 'display',
		valueField : 'value',
		typeAhead : true,
		queryMode : 'local',
		triggerAction : 'all',
		selectOnFocus : true,
		allowBlank : false,
		editable : false,
		value : 'email',
		flex : 1
	    });
	this.alertTypeField
	    .on('select', this.onAlertTypeSelectFn, this);

	this.alertEarlyTimeField = this.alertEarlyTimeField
	    || Ext.create('Ext.form.NumberField', {
		hideLabel : true,
		labelSeparator : '',
		value : 3,
		sender : this,
		//				validator : this.alertEarlyTimeValidator,
		allowBlank : false,
		style : 'margin-left:10px;',
		flex : 1
	    });

	this.alertUnitField = this.alertUnitField
	    || Ext.create('Ext.form.field.ComboBox', {
		hideLabel : true,
		labelSeparator : '',
		store : Ext.ux.calendar.Mask
		    .getAlertUnitStore(),
		displayField : 'display',
		valueField : 'value',
		typeAhead : true,
		queryMode : 'local',
		triggerAction : 'all',
		selectOnFocus : true,
		allowBlank : false,
		editable : false,
		value : 'jour',
		style : 'margin-left:10px;',
		flex : 1
	    });
	this.alertUnitField
	    .on('select', this.onAlertUnitSelectFn, this);

	this.alertEarlyField = this.alertEarlyField
	    || Ext.create('Ext.form.Label', {
		style : 'margin-left:10px;line-height:22px;',
		html : lan['alertEarly.label'],
		flex : .6
	    });
	Ext.apply(this, {
	    style : 'padding: 0 0 0 5px;',
	    autoHeight : true,
	    labelWidth : 50,
	    onRemoveAlertFn : Ext.emptyFn,
	    // onAddAlertFn: new this.alertSetting(), // Ext.ux.calendar.AlertSetting(),
	    border : false,
	    bodyStyle : 'background:none;',
	    layout : {
		type : 'hbox'
	    },
	    items : [this.alertTypeField,
		     this.alertEarlyTimeField,
		     this.alertUnitField, 
		     this.alertEarlyField, 
		     this.emailsAddrField,
		     this.deleteAlertBtn,
		     this.addAlertBtn]
	    // this.emailsPanel,


	})
	this.callParent(arguments);
    },
    setup : function(setting) {
	this.alertTypeField.setValue(setting.type);
	this.alertUnitField.setValue(setting.unit);
	this.alertEarlyTimeField.setValue(setting.early);
	this.onAlertTypeSelectFn();
    },

    getSetting : function() {
	return {
	    type : this.alertTypeField.getValue(),
	    early : this.alertEarlyTimeField.getValue(),
	    unit : this.alertUnitField.getValue(),
	    emails: this.emailsAddrField.getValue()
	};
    },
    onAlertTypeSelectFn : function() {
	var alertType = this.alertTypeField.getValue();
	var store = this.alertUnitField.store;
	store.removeAll();
	var lan = Ext.ux.calendar.Mask.Mask;
	if ('popup' == alertType) {
	    store.loadData(lan['popupAlertUnit']);
	} else if ('email' == alertType) {
	    store.loadData(lan['alertUnit']);
	}
	this.alertEarlyTimeField.setValue(this.alertEarlyTimeField
					  .getValue());
    },
    onAlertUnitSelectFn : function() {
	this.alertEarlyTimeField.setValue(this.alertEarlyTimeField
					  .getValue());
    },
    alertEarlyTimeValidator : function(v) {
	var alertType = this.sender.alertTypeField.getValue();
	var unit = this.sender.alertUnitField.getValue();
	if (0 <= v) {
	    if ('popup' == alertType) {
		if ('hour' == unit) {
		    v = 60 * v;
		}
		if (v <= 24 * 60) {
		    return true;
		}
		return Ext.ux.calendar.Mask.Editor['popupAlertEarlyInvalid'];
	    } else if ('email' == alertType) {
		if ('hour' == unit) {
		    v = 60 * v;
		} else if ('day' == unit) {
		    v = 60 * 24 * v;
		} else if ('week' == unit) {
		    v = 60 * 24 * 7 * v;
		}
		if (30 <= v) {
		    return true;
		}
		return Ext.ux.calendar.Mask.Editor['emailAlertEarlyInvalid'];
	    }
	}
    },
    isValid : function() {
	return this.alertEarlyTimeField.isValid();
    }
});
