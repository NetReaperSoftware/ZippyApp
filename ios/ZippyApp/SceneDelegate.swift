import UIKit
import React_RCTAppDelegate

/// Hosts the React Native root view under the UIScene lifecycle.
///
/// React Native does not ship UIScene support (still absent as of 0.86), so the
/// window is created here and handed to the factory that AppDelegate built at
/// launch, rather than being owned by the app delegate itself.
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene,
          let appDelegate = UIApplication.shared.delegate as? AppDelegate,
          let factory = appDelegate.reactNativeFactory
    else {
      return
    }

    let window = UIWindow(windowScene: windowScene)
    self.window = window
    // React Native reads the window off the app delegate, so keep it in sync.
    appDelegate.window = window

    factory.startReactNative(
      withModuleName: "ZippyApp",
      in: window,
      launchOptions: appDelegate.launchOptions
    )
  }
}
