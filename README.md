# @codewave-ui/core

Core Library for CodewaveUI

## Error Code

### 10xx

Related to driver.

- [ERR1001] Driver session has been closed. Probably the driver has been crashed or you forgot to initialize it in the
  first place.
- [ERR1002] Session is null! Probably because of crash or you are using keyword before initiating the driver session.

### 20xx

Related to keywords.

- [ERR2001] Failed to execute keyword '<keyword_name>'! Keyword can not run on '<platform_name>' platform.
- [ERR2002] Invalid argument given! Name: <args_name>; Expected to be: <expected_args>; Given: <given_args>
- [ERR2003] No such element
- [ERR2004] Element is not visible!
- [ERR2005] Element is visible!
- [ERR2006] Element click action is intercepted because there is another element on top of it!
- [ERR2007] Failed to match element text\n Actual - Expected\n+ <actual> \n- <expected>
- [ERR2100] Actual is not bigger than expected:\n+ Actual - Expected\n+ <actual> \n- <expected>
- [ERR2101] Actual is not bigger than equals expected:\n+ Actual - Expected\n+ <actual> \n- <expected>
- [ERR2102] Actual is not smaller than expected:\n+ Actual - Expected\n+ <actual> \n- <expected>
- [ERR2103] Actual is not smaller than equals expected:\n+ Actual - Expected\n+ <actual> \n- <expected>

### 30xx

Related to listeners.

- [ERR3001] Failed to execute before step! <error_logs>
- [ERR3002] Failed to execute after step! <error_logs>

### 50xx

Related to tests/runners.

- [ERR5001] Runner does not exist!