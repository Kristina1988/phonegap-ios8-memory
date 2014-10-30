A simple app to test memory accretion with iOS 8.1

This application simply uses a PhoneGap application that demonstrates that either PhoneGap for iOS8.1 or the iOS8.1 JavaScript VM has problems with the JavaScript to ObjectiveC communication.  
*NOTE*: This is not a problem with iOS 7.1.

To see for yourself:
- Clone this project (in a mac, obviously).
- Open <your project dir>/Test/Platforms/ios/Test.xcodeproj in xcode
- Select an IOS 8.1 simulator or device
- Run the project
- Watch the memory report in XCode (debug navigator) 

The test:
Below is the ObjectiveC code that contains a methoed named `testFn`. `testFn` is called by a modified copy of Cordova's index.js and generates 100000 random integers and adds them to an array to be returned by the calling plugin method execution request inside of index.js.

Here's the testFn method:

```
- (void) testFn:(CDVInvokedUrlCommand*)command {

    NSMutableArray *array = [[NSMutableArray alloc] init];

    int randomNum;
    NSNumber *num;
    
    for (int i=0; i < 100000; i++) {
        randomNum = arc4random_uniform(74);
        num       = [[NSNumber alloc] initWithInt:randomNum];
        
        [array addObject:num];
    }
    
     
    NSDictionary * dict = [[NSDictionary alloc]
                initWithObjectsAndKeys:
                    array,   @"data",
                    nil
                ];

    
    CDVPluginResult *pluginResult = [CDVPluginResult
                                    resultWithStatus : CDVCommandStatus_OK
                                    messageAsDictionary  : dict
                                ];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}
```

index.js is modified to register a click handler of the "device is ready" div found in the hello world phonegap application.  When the app is started `this.getData()` is executed every 5ms. `this.getData()`, is what is responsible for executing `testFn` in the above plugin and will simply update the "device is ready" div, displaying the execution number.

```
    receivedEvent: function(id) {

        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        
        this.receivedElement = receivedElement;
        
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        this.runNumber = 0;
        
        var me = this;
        setInterval(function() {
            me.getData();
        }, 5);
    },

    getData : function() {
        console.log('getSomeData');
        var me = this;
        cordova.exec(
            function callback(data) {
                me.receivedElement.innerHTML = ++me.runNumber;
            },
            function errorHandler(err) {
                console.log('testFn error');
            },
            'APlugin',
            'testFn',
            []
        );
    }
```
