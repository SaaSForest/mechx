import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  Share,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  DotsThreeVertical,
  Sparkle,
  Clock,
  Tag,
  SealCheck,
  Star,
  ChatCircleDots,
  Check,
  Funnel,
  CheckCircle,
  PencilSimple,
  Trash,
  Export,
  X,
  XCircle,
} from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';
import { Card, Badge, Avatar, Button } from '../../components/ui';
import { EmptyState } from '../../components/shared';
import { formatRelativeTime } from '../../utils/date';
import useRequestStore from '../../store/requestStore';
import useOfferStore from '../../store/offerStore';
import useReviewStore from '../../store/reviewStore';

const RequestDetailScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const initialRequest = route.params?.request;

  const { selectedRequest, getRequest, markComplete, deleteRequest, updateRequest, isLoading: requestLoading } = useRequestStore();
  const { acceptOffer, rejectOffer, isLoading: offerLoading } = useOfferStore();
  const { canReview, hasReviewed, checkCanReview } = useReviewStore();

  const [refreshing, setRefreshing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const request = selectedRequest || initialRequest;
  const offers = request?.offers || [];
  const acceptedOffer = offers.find(o => o.status === 'accepted');

  useEffect(() => {
    if (initialRequest?.id) {
      getRequest(initialRequest.id);
    }
  }, [initialRequest?.id]);

  useEffect(() => {
    // Check if user can review when there's an accepted offer and request is completed
    if (acceptedOffer && request?.status === 'completed') {
      checkCanReview(acceptedOffer.id);
    }
  }, [acceptedOffer?.id, request?.status]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getRequest(initialRequest?.id);
    setRefreshing(false);
  };

  const handleAcceptOffer = (offer) => {
    Alert.alert(
      'Accept Offer',
      `Accept offer from ${offer.seller?.full_name || 'seller'} for L${offer.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            const result = await acceptOffer(offer.id);
            if (result.success) {
              Alert.alert('Success', 'Offer accepted! The seller will contact you shortly.');
              getRequest(initialRequest?.id);
            } else {
              Alert.alert('Error', result.error || 'Failed to accept offer');
            }
          },
        },
      ]
    );
  };

  const handleMarkComplete = () => {
    Alert.alert(
      'Mark as Complete',
      'Confirm that you have received the part and the transaction is complete?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            const result = await markComplete(request.id);
            if (result.success) {
              Alert.alert('Success', 'Transaction marked as complete! You can now leave a review.');
            } else {
              Alert.alert('Error', result.error || 'Failed to mark as complete');
            }
          },
        },
      ]
    );
  };

  const handleLeaveReview = () => {
    navigation.navigate('LeaveReview', {
      offer: acceptedOffer,
      seller: acceptedOffer?.seller,
      partName: request.part_name,
    });
  };

  const handleViewSellerReviews = (seller) => {
    navigation.navigate('SellerReviews', { seller });
  };

  const handleMessage = (offer) => {
    navigation.navigate('Messages', {
      screen: 'Chat',
      params: {
        conversation: {
          other_user: {
            id: offer.seller?.id,
            full_name: offer.seller?.full_name,
            profile_photo_url: offer.seller?.profile_photo_url,
          }
        }
      },
    });
  };

  // Menu handlers
  const handleEditRequest = () => {
    setShowMenu(false);
    navigation.navigate('CreateRequest', { editMode: true, request });
  };

  const handleDeleteRequest = () => {
    setShowMenu(false);
    Alert.alert(
      'Delete Request',
      'Are you sure you want to delete this request? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteRequest(request.id);
            if (result.success) {
              Alert.alert('Success', 'Request deleted successfully');
              navigation.goBack();
            } else {
              Alert.alert('Error', result.error || 'Failed to delete request');
            }
          },
        },
      ]
    );
  };

  const handleShareRequest = async () => {
    setShowMenu(false);
    try {
      await Share.share({
        message: `Looking for ${request.part_name} for ${request.car_year} ${request.car_make} ${request.car_model} on mechX app!`,
        title: `Part Request: ${request.part_name}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share this request');
    }
  };

  const handleCloseRequest = () => {
    setShowMenu(false);
    Alert.alert(
      'Close Request',
      'Are you sure you want to close this request? You won\'t receive any more offers.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Close Request',
          style: 'destructive',
          onPress: async () => {
            const result = await updateRequest(request.id, { status: 'closed' });
            if (result.success) {
              Alert.alert('Success', 'Request closed successfully');
              getRequest(request.id);
            } else {
              Alert.alert('Error', result.error || 'Failed to close request');
            }
          },
        },
      ]
    );
  };

  // Check if user can edit/delete (only for active requests)
  const canModify = request?.status === 'active';

  const renderOffer = (offer) => {
    const isAccepted = offer.status === 'accepted';
    const isPending = offer.status === 'pending';
    const seller = offer.seller || {};

    return (
      <Card key={offer.id} padding={20} style={styles.offerCard}>
        {/* Seller Info */}
        <View style={styles.offerHeader}>
          <TouchableOpacity
            style={styles.sellerInfo}
            onPress={() => handleViewSellerReviews(seller)}
          >
            <Avatar
              source={seller.profile_photo_url}
              name={seller.full_name}
              size={48}
            />
            <View style={styles.sellerDetails}>
              <View style={styles.sellerNameRow}>
                <Text style={styles.sellerName}>{seller.full_name}</Text>
                {seller.is_verified && (
                  <SealCheck size={18} weight="fill" color={colors.success} />
                )}
              </View>
              <TouchableOpacity
                style={styles.ratingRow}
                onPress={() => handleViewSellerReviews(seller)}
              >
                <Star size={14} weight="fill" color="#F59E0B" />
                <Text style={styles.ratingText}>
                  {Number(seller.rating || 0).toFixed(1)} ({seller.sales_count || 0} sales)
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          <View style={styles.offerMeta}>
            <Text style={styles.offerPrice}>L {offer.price}</Text>
            {!isPending && (
              <Badge
                text={offer.status}
                status={isAccepted ? 'completed' : 'cancelled'}
                size="small"
              />
            )}
          </View>
        </View>

        {/* Offer Details */}
        <View style={styles.offerDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Condition</Text>
            <Text style={styles.detailValue}>{offer.part_condition}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Delivery</Text>
            <Text style={styles.detailValue}>{offer.delivery_time}</Text>
          </View>
        </View>

        {/* Notes */}
        {offer.notes && (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{offer.notes}</Text>
          </View>
        )}

        {/* Actions - only show for pending offers on active requests */}
        {isPending && request?.status === 'active' && (
          <View style={styles.offerActions}>
            <TouchableOpacity
              onPress={() => handleMessage(offer)}
              style={styles.messageButton}
            >
              <ChatCircleDots size={20} color={colors.brand[500]} />
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleAcceptOffer(offer)}
              style={styles.acceptButton}
            >
              <Check size={20} color={colors.white} />
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Message button for accepted offers */}
        {isAccepted && (
          <TouchableOpacity
            onPress={() => handleMessage(offer)}
            style={[styles.messageButton, { marginTop: 12 }]}
          >
            <ChatCircleDots size={20} color={colors.brand[500]} />
            <Text style={styles.messageButtonText}>Message Seller</Text>
          </TouchableOpacity>
        )}
      </Card>
    );
  };

  if (!request) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
          >
            <ArrowLeft size={24} color={colors.gray[600]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Request Details</Text>
          <View style={styles.headerButton} />
        </View>
        <EmptyState
          icon={<Tag size={40} color={colors.gray[400]} />}
          title="Request not found"
          description="This request may have been deleted."
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <ArrowLeft size={24} color={colors.gray[600]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Details</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setShowMenu(true)}
        >
          <DotsThreeVertical size={24} color={colors.gray[600]} />
        </TouchableOpacity>
      </View>

      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Options</Text>
              <TouchableOpacity onPress={() => setShowMenu(false)}>
                <X size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            {canModify && (
              <TouchableOpacity style={styles.menuItem} onPress={handleEditRequest}>
                <View style={[styles.menuItemIcon, { backgroundColor: colors.brand[50] }]}>
                  <PencilSimple size={20} color={colors.brand[500]} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>Edit Request</Text>
                  <Text style={styles.menuItemSubtitle}>Modify request details</Text>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.menuItem} onPress={handleShareRequest}>
              <View style={[styles.menuItemIcon, { backgroundColor: '#EFF6FF' }]}>
                <Export size={20} color="#2563EB" />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemTitle}>Share Request</Text>
                <Text style={styles.menuItemSubtitle}>Share with others</Text>
              </View>
            </TouchableOpacity>

            {canModify && (
              <TouchableOpacity style={styles.menuItem} onPress={handleCloseRequest}>
                <View style={[styles.menuItemIcon, { backgroundColor: '#FEF3C7' }]}>
                  <XCircle size={20} color="#D97706" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>Close Request</Text>
                  <Text style={styles.menuItemSubtitle}>Stop receiving offers</Text>
                </View>
              </TouchableOpacity>
            )}

            {canModify && (
              <TouchableOpacity style={styles.menuItem} onPress={handleDeleteRequest}>
                <View style={[styles.menuItemIcon, { backgroundColor: colors.error + '15' }]}>
                  <Trash size={20} color={colors.error} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemTitle, { color: colors.error }]}>Delete Request</Text>
                  <Text style={styles.menuItemSubtitle}>Permanently remove</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Modal>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.brand[500]}
          />
        }
      >
        {/* Request Info Card */}
        <Card padding={20} style={styles.requestCard}>
          <View style={styles.requestHeader}>
            <View style={styles.requestInfo}>
              <Text style={styles.requestTitle}>{request.part_name}</Text>
              <Text style={styles.requestSubtitle}>
                {request.car_make} {request.car_model} ({request.car_year})
              </Text>
            </View>
            <Badge text={request.status} status={request.status} />
          </View>

          <View style={styles.requestStats}>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Sparkle size={18} color={colors.gray[500]} />
              </View>
              <Text style={styles.statLabel}>Condition</Text>
              <Text style={styles.statValue}>{request.condition_preference || 'Any'}</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Clock size={18} color={colors.gray[500]} />
              </View>
              <Text style={styles.statLabel}>Posted</Text>
              <Text style={styles.statValue}>{formatRelativeTime(request.created_at)}</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Tag size={18} color={colors.gray[500]} />
              </View>
              <Text style={styles.statLabel}>Offers</Text>
              <Text style={styles.statValue}>{offers.length}</Text>
            </View>
          </View>
        </Card>

        {/* Action Buttons for pending/completed status */}
        {request.status === 'pending' && acceptedOffer && (
          <Card padding={16} style={styles.actionCard}>
            <View style={styles.actionInfo}>
              <CheckCircle size={24} color={colors.success} weight="fill" />
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Offer Accepted</Text>
                <Text style={styles.actionSubtitle}>
                  Mark as complete when you receive your part
                </Text>
              </View>
            </View>
            <Button
              title="Mark as Complete"
              onPress={handleMarkComplete}
              loading={requestLoading}
              style={styles.actionButton}
            />
          </Card>
        )}

        {request.status === 'completed' && acceptedOffer && !hasReviewed && canReview && (
          <Card padding={16} style={styles.actionCard}>
            <View style={styles.actionInfo}>
              <Star size={24} color="#F59E0B" weight="fill" />
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Leave a Review</Text>
                <Text style={styles.actionSubtitle}>
                  Share your experience with this seller
                </Text>
              </View>
            </View>
            <Button
              title="Leave Review"
              onPress={handleLeaveReview}
              variant="secondary"
              style={styles.actionButton}
            />
          </Card>
        )}

        {request.status === 'completed' && hasReviewed && (
          <Card padding={16} style={styles.actionCard}>
            <View style={styles.completedInfo}>
              <Check size={20} color={colors.success} weight="bold" />
              <Text style={styles.completedText}>You've reviewed this transaction</Text>
            </View>
          </Card>
        )}

        {/* Offers Section */}
        <View style={styles.offersHeader}>
          <Text style={styles.offersTitle}>
            Offers <Text style={styles.offersCount}>({offers.length})</Text>
          </Text>
          {offers.length > 1 && (
            <TouchableOpacity style={styles.sortButton}>
              <Funnel size={18} color={colors.gray[500]} />
              <Text style={styles.sortButtonText}>Sort by price</Text>
            </TouchableOpacity>
          )}
        </View>

        {offers.length > 0 ? (
          offers.map(renderOffer)
        ) : (
          <Card padding={24}>
            <EmptyState
              icon={<Tag size={32} color={colors.gray[400]} />}
              title="No offers yet"
              description="Sellers will submit offers soon. Check back later!"
            />
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    color: colors.gray[900],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  requestCard: {
    marginBottom: 16,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  requestInfo: {
    flex: 1,
    marginRight: 12,
  },
  requestTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 20,
    color: colors.gray[900],
    marginBottom: 4,
  },
  requestSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 15,
    color: colors.gray[500],
  },
  requestStats: {
    flexDirection: 'row',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.gray[500],
    marginBottom: 2,
  },
  statValue: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.gray[900],
    textTransform: 'capitalize',
  },
  actionCard: {
    marginBottom: 16,
  },
  actionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  actionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.gray[900],
  },
  actionSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 2,
  },
  actionButton: {
    marginTop: 0,
  },
  completedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  completedText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.success,
  },
  offersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  offersTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    color: colors.gray[900],
  },
  offersCount: {
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[400],
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sortButtonText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[500],
  },
  offerCard: {
    marginBottom: 16,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sellerDetails: {
    marginLeft: 12,
    flex: 1,
  },
  sellerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sellerName: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.gray[900],
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.gray[500],
  },
  offerMeta: {
    alignItems: 'flex-end',
    gap: 6,
  },
  offerPrice: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 24,
    color: colors.brand[500],
  },
  offerDetails: {
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  detailLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[500],
  },
  detailValue: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.gray[900],
    textTransform: 'capitalize',
  },
  messageBox: {
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  messageText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 20,
  },
  offerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.brand[500],
  },
  messageButtonText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 15,
    color: colors.brand[500],
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.success,
  },
  acceptButtonText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 15,
    color: colors.white,
  },
  // Menu Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  menuTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    color: colors.gray[900],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[50],
  },
  menuItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.gray[900],
  },
  menuItemSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.gray[500],
    marginTop: 2,
  },
});

export default RequestDetailScreen;
