package hr.tvz.dreamteam.eventhub.web.transactions;

import hr.tvz.dreamteam.eventhub.domain.PaymentStatus;
import hr.tvz.dreamteam.eventhub.web.transactions.model.TransactionDTO;
import hr.tvz.dreamteam.eventhub.web.transactions.model.TransactionRequest;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api")
@AllArgsConstructor
public class TransactionController {

    private TransactionService transactionService;

    @Secured({"ROLE_USER", "ROLE_ADMIN"})
    @PostMapping("/transaction")
    public ResponseEntity<Object> assignTickets(@RequestBody TransactionRequest transactionRequest) {
        try {
            transactionService.assignTickets(transactionRequest);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON).body(ex.getMessage());
        }
    }

    @Secured("ROLE_ADMIN")
    @GetMapping("/transactions/all")
    public Page<TransactionDTO> getAllCurrentOrganizerEvents(@RequestParam(name = "page", defaultValue = "0") int page,
                                                             @RequestParam(name = "size", defaultValue = "5") int size,
                                                             @RequestParam(required = false) String searchQuery,
                                                             @RequestParam(required = false, name = "status") PaymentStatus status) {

        return transactionService.findAllTransactions(searchQuery, status, page, size);
    }

}
