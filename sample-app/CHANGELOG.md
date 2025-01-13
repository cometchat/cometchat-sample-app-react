## [5.0.1] - 13-01-2025

#### New
- None  

#### Enhancements
- None  

#### Fixes
- Removed unused dependencies to improve application performance and reduce build size.  
- Adjusted the minimum width of the sidebar and tabs to ensure proper layout rendering when the sample app is displayed within fixed-width containers.  
- Resolved a flickering issue on the **Banned Member** page when clicking the "Banned Member" option, ensuring a smoother user experience.  

## [5.0.0] - 03-01-2025

### New
- None

### Enhancements
- Updated CometChat React UI Kit version to v5.0.0

### Fixes
- Fixed an issue where the empty state in the Group Members component was not fully visible.
- Fixed an issue where the Transfer Ownership prompt incorrectly appeared when attempting to leave a group with only one member.
- Fixed an issue where the selected call log was not highlighted as active in the call logs list.
- Fixed an issue where the unban option was not visible in the Banned Members View.
- Fixed an issue where the avatar in Outgoing call was not proper when a call is initiated via Call log detail.

## [5.0.0-beta2] - 10-12-2024

### New
- Introduced a feature to seamlessly open a user's conversation by clicking on their mention.

### Enhancements
- Updated the incoming call icon in Call History component.
- Refined the group listing in new conversations to display only the groups the logged-in user is a member of.

### Fixes
- Resolved an issue where the Details component did not open with the correct width in iPad browsers.
- Fixed an issue where unblocking a user from the composer did not update the "Unblock User" menu to "Block User" in the user details.