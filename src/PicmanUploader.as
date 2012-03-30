package 
{
	public class PicmanUploader
	{
		private var _fileCountLimit:uint = 0;
		private var _state:String;
		private var _enabled:Boolean;

		public function PicmanUploader()
		{
		}

		public function canSelectFile():Boolean {
			return _enabled && _fileCountLimit > 0;
		}
		
		/**
		  * 设置可交互属性
		  * 
		  * - false: 禁用所有交互功能
		  * - true:  启用交互功能
		  *
		  * 配置一个 enabled 属性的作用: 
		  * 有些时候，就算目标相册可以继续上传，我们也会
		  * 人为地禁用上传功能。例如总相册空间已满，或其他
		  * 特殊情况。
		  */
		public function get enabled():Boolean {
			return _enabled;
		}
		
		public function set enabled(value:Boolean):void {
			_enabled = value;
		}
		
		public function get fileCountLimit():uint {
			return _fileCountLimit;
		}
		
		public function set fileCountLimit(value:uint):void {
			_fileCountLimit = value;
		}

		public function get state():String {
			return _state;
		}
		
		public function set state(value:String):void {
			_state = value;
		}
		
		
		
	}


}