package 
{
	import flash.events.*;

	public class ThumbEvent extends DataEvent
	{

		static public const LOADED:String = 'loaded';

		public function ThumbEvent(type:String, data:String = "", bubbles:Boolean = false, cancelable:Boolean = false)
		{
			super(type, bubbles, cancelable, data);
		}

		override public function clone():Event
		{
			return new ThumbEvent(type, data, bubbles, cancelable);
		}
		
	}


}