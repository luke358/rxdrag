import { AbstractActivity, Activity, Input } from "@rxdrag/minions-runtime"
import { INodeDefine } from "@rxdrag/minions-schema"

export interface IIntervalConfig {
  interval?: number
}

@Activity(Signals.NAME)
export class Signals extends AbstractActivity<IIntervalConfig> {
  public static NAME = "system.signals"
  public static INPUT_NAME_STARTUP = "startUp"
  public static INPUT_NAME_STOP = "stop"

  timer?: NodeJS.Timer
  inputValue?: any
  constructor(meta: INodeDefine<IIntervalConfig>) {
    super(meta)
  }

  @Input(Signals.INPUT_NAME_STARTUP)
  startUpHandler = (inputValue?: any) => {
    this.stopHandler()
    this.inputValue = inputValue
    if (this.meta.config?.interval) {
      this.timer = setInterval(this.handleOutput, this.meta.config?.interval)
      console.log("启动定时器", this.timer)
    }
  }

  @Input(Signals.INPUT_NAME_STOP)
  stopHandler = () => {
    if (this.timer) {
      console.log("停止定时器", this.timer)
      clearInterval(this.timer)
      this.timer = undefined
    }
  }

  handleOutput = () => {
    this.next(this.inputValue)
  }

  destroy = () => {
    console.log("定时器销毁", this.timer)
    this.stopHandler()
  }
}