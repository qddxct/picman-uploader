jQuery(function($){

    var uploader;

    function initUploader(container, swf) {
        if($.util.flash.version.major < 10){
            showFlashUpgradeMsg();
        } else { 
            swf = swf ||  'flash/picman-uploader.swf?v=2012041801'
            var cont = $(container).empty();
            uploader = cont.flash({
                swf               : swf,
                width             : '100%',
                height            : '100%',
                allowScriptAccess : 'always',
                flashvars : {
                    eventHandler  : 'jQuery.util.flash.triggerHandler',
                    swfid         : 'flash-alt',
                    debug         : true
                }
            });

            initEventBindings();
        }
    }

    function showFlashUpgradeMsg(container) {
        $('.upgrade-msg', container).show();
    }

    function initEventBindings() {

        uploader.bind('swfReady', function(){
            var swf = getFlash();
            swf.setRequestCharset( 'utf-8' );
            swf.setResponseCharset( 'utf-8' );
            swf.setTargetAlbum({id: -1, remain:10});
        });

        uploader.bind('setWatermark', function(){
            alert('TODO: ����ˮӡ');
        });

        /**
        * �û�������ϴ���ť,�������¼�
        */
        uploader.bind('clickUploadBtn', uploadAllFiles);

        /**
        * ͼƬ�Ѿ��ϴ��������������յ����������ص�����
        * �Է���������������д����ж��ϴ��Ƿ�ɹ�
        * ���ϴ����ɹ�����Ҫ���´�����ʾ
        */
        uploader.bind('transferCompleteData', checkFileByResponse );
            
        /**
        * ͼƬ�����ͻ��˴����û�б����䵽������
        * ԭ���Ǵ������ͼƬ��Ȼû�дﵽ�޶����ֽ���֮��
        * ��˴���ȡ��
        */
        uploader.bind('transferAbort', function(evt, o){
            var file = o.file;
            updateFileMsg( file, getErrorMsg(file.msg) );
        });

        /**
        * ����ʧ���¼��Ĵ���
        * ��Ϊ����ԭ�����紫���п���ʧ��
        */
        uploader.bind('transferError', function(evt, o){
            updateFileMsg( o.file, getErrorMsg() );
        });

        /**
        * �����ļ����Ѿ��������
        * ��Щ�ļ���״̬�仯û�ж�Ӧ���¼�������������ͳһ����
        */
        uploader.bind('finish', function(evt, o){});

        uploader.bind('skipToNextStep', function(evt, o){
            alert('TODO: skip to next step');
        });
    }

    function getFlash() {
        return uploader.flash('getFlash');
    }

    function uploadAllFiles() {
        var swf = getFlash();
        swf.uploadAll(
            'http://localhost:4567/random', {
                watermark: swf.shouldAddWatermark()
            }, 
            'FileData',  // �����ֶ�����, 'imgFile' for ibank
            'fname'      // ��Ǳ�Ҫ,��Ҫ�޸�
        );
    }
    
    function checkFileByResponse(evt, o){
        var file = o.file;
        var ret = getResultFromResponse( file.msg );
        var swf = getFlash();
        if(ret.success){
            swf.destroyFile( file.id );
            swf.updateFileList();
        } else {
            updateFileStatus( file.id, 'transfer_fail', ret.msg );

            // �����ռ�������ʣ�µ�ͼƬ�������ϴ�
            if( ret.err == 'maxImageSpaceExceed' || ret.err == 'maxImgPerAlbumExceeded' ){
                swf.dropRemainingFiles( ret.msg );
            }
        }
    }

    function getResultFromResponse( res ) {
        var obj={}, success, msg;

        try { obj = $.parseJSON(res); }
        catch(e) {}

        success = (obj.result === 'success');
        if( !success ){
            msg = getErrorMsg( obj.msg ); 
        }

        return { success: success, msg: msg, err: obj.msg };
    }

    function getErrorMsg( errCode ) {
        var map = {
            'COMPRESS_FAIL' : '�޷�ѹ����2MB���ڣ�����С�����ϴ�',
            'notLogin'      : '����δ��¼���޷��ϴ�ͼƬ��',
            'imgTooBig'     : 'ͼƬ�����2MB���޷��ϴ�!',
            'imgTypeErr'    : 'ͼƬ��ʽ���ԣ�ϵͳ֧�� jpg, jpeg, png, gif, bmp',
            'maxImageSpaceExceed'    : '����ܿռ�����',
            'maxImgPerAlbumExceeded' : 'Ŀ�����������������ϴ��������ϴ�'
        };
        
        return map[errCode] || '���緱æ������ԭ����ʱ�޷��ϴ������Ժ����ԣ�';
    }

    function updateFileStatus( id, stt, msg ) {
        getFlash().updateFileStatus( id, stt, msg );
    }

    function updateFileMsg( file, msg ) {
        updateFileStatus( file.id, file.status, msg );
    }

    window.initUploader = initUploader;

});
