import Reporter from './reporter'

export default class NullReporter extends Reporter {
  public write = (): void => {}
}
